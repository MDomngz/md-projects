import type { Discrepancy } from "../components/design-comparison";

interface DetectOptions {
  depth: "quick" | "detailed";
  selectedArea?: { x: number; y: number; width: number; height: number } | null;
}

const MAX_WORKING_DIMENSION = 1200;

function estimateBestOffset(
  figmaPixels: Uint8ClampedArray,
  productionPixels: Uint8ClampedArray,
  width: number,
  height: number,
  maxOffset: number,
  sampleStep: number
) {
  let bestOffsetX = 0;
  let bestOffsetY = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let offsetY = -maxOffset; offsetY <= maxOffset; offsetY += 1) {
    for (let offsetX = -maxOffset; offsetX <= maxOffset; offsetX += 1) {
      let totalDiff = 0;
      let samples = 0;

      for (let y = sampleStep; y < height - sampleStep; y += sampleStep) {
        const py = y + offsetY;
        if (py < 0 || py >= height) continue;

        for (let x = sampleStep; x < width - sampleStep; x += sampleStep) {
          const px = x + offsetX;
          if (px < 0 || px >= width) continue;

          const figmaIndex = (y * width + x) * 4;
          const productionIndex = (py * width + px) * 4;

          const dr = Math.abs(figmaPixels[figmaIndex] - productionPixels[productionIndex]);
          const dg = Math.abs(figmaPixels[figmaIndex + 1] - productionPixels[productionIndex + 1]);
          const db = Math.abs(figmaPixels[figmaIndex + 2] - productionPixels[productionIndex + 2]);

          totalDiff += dr * 0.34 + dg * 0.5 + db * 0.16;
          samples += 1;
        }
      }

      if (!samples) continue;

      const meanDiff = totalDiff / samples;
      if (meanDiff < bestScore) {
        bestScore = meanDiff;
        bestOffsetX = offsetX;
        bestOffsetY = offsetY;
      }
    }
  }

  return { offsetX: bestOffsetX, offsetY: bestOffsetY };
}

function createAlignedPixelBuffer(
  productionPixels: Uint8ClampedArray,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
) {
  const aligned = new Uint8ClampedArray(productionPixels.length);

  for (let y = 0; y < height; y += 1) {
    const sourceY = y + offsetY;
    if (sourceY < 0 || sourceY >= height) continue;

    for (let x = 0; x < width; x += 1) {
      const sourceX = x + offsetX;
      if (sourceX < 0 || sourceX >= width) continue;

      const targetIndex = (y * width + x) * 4;
      const sourceIndex = (sourceY * width + sourceX) * 4;
      aligned[targetIndex] = productionPixels[sourceIndex];
      aligned[targetIndex + 1] = productionPixels[sourceIndex + 1];
      aligned[targetIndex + 2] = productionPixels[sourceIndex + 2];
      aligned[targetIndex + 3] = productionPixels[sourceIndex + 3];
    }
  }

  return aligned;
}

function erodeMask(mask: Uint8Array, width: number, height: number) {
  const eroded = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const centerIndex = y * width + x;
      if (!mask[centerIndex]) continue;

      let activeNeighbors = 0;
      for (let oy = -1; oy <= 1; oy += 1) {
        const ny = y + oy;
        if (ny < 0 || ny >= height) continue;

        for (let ox = -1; ox <= 1; ox += 1) {
          const nx = x + ox;
          if (nx < 0 || nx >= width) continue;

          if (mask[ny * width + nx]) activeNeighbors += 1;
        }
      }

      // Keep robust pixels while removing isolated noise around edges.
      eroded[centerIndex] = activeNeighbors >= 5 ? 1 : 0;
    }
  }

  return eroded;
}

function dilateMask(mask: Uint8Array, width: number, height: number) {
  const dilated = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let activeNeighbors = 0;
      for (let oy = -1; oy <= 1; oy += 1) {
        const ny = y + oy;
        if (ny < 0 || ny >= height) continue;

        for (let ox = -1; ox <= 1; ox += 1) {
          const nx = x + ox;
          if (nx < 0 || nx >= width) continue;

          if (mask[ny * width + nx]) activeNeighbors += 1;
        }
      }

      // Expand strong components and close tiny interior gaps.
      dilated[y * width + x] = activeNeighbors >= 2 ? 1 : 0;
    }
  }

  return dilated;
}

function cleanDiffMask(mask: Uint8Array, width: number, height: number) {
  // Use a lighter close-only pass to preserve subtle but real discrepancy regions.
  return erodeMask(dilateMask(mask, width, height), width, height);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for local analysis"));
    img.src = src;
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function detectDiscrepanciesFromImages(
  figmaImage: string,
  productionImage: string,
  options: DetectOptions
): Promise<Discrepancy[]> {
  const [figma, production] = await Promise.all([
    loadImage(figmaImage),
    loadImage(productionImage),
  ]);

  const baseWidth = figma.naturalWidth || figma.width;
  const baseHeight = figma.naturalHeight || figma.height;
  const productionWidth = production.naturalWidth || production.width;
  const productionHeight = production.naturalHeight || production.height;

  if (!baseWidth || !baseHeight) {
    return [];
  }

  const downscale = Math.min(1, MAX_WORKING_DIMENSION / Math.max(baseWidth, baseHeight));
  const workWidth = Math.max(1, Math.round(baseWidth * downscale));
  const workHeight = Math.max(1, Math.round(baseHeight * downscale));

  const figmaCanvas = document.createElement("canvas");
  const productionCanvas = document.createElement("canvas");
  figmaCanvas.width = workWidth;
  figmaCanvas.height = workHeight;
  productionCanvas.width = workWidth;
  productionCanvas.height = workHeight;

  const figmaCtx = figmaCanvas.getContext("2d", { willReadFrequently: true });
  const productionCtx = productionCanvas.getContext("2d", { willReadFrequently: true });

  if (!figmaCtx || !productionCtx) {
    return [];
  }

  figmaCtx.drawImage(figma, 0, 0, workWidth, workHeight);
  productionCtx.drawImage(production, 0, 0, workWidth, workHeight);

  const figmaPixels = figmaCtx.getImageData(0, 0, workWidth, workHeight).data;
  const productionPixels = productionCtx.getImageData(0, 0, workWidth, workHeight).data;

  const maxOffset = Math.max(2, Math.min(24, Math.round(Math.max(workWidth, workHeight) * 0.025)));
  const sampleStep = options.depth === "detailed" ? 4 : 6;
  const bestOffset = estimateBestOffset(
    figmaPixels,
    productionPixels,
    workWidth,
    workHeight,
    maxOffset,
    sampleStep
  );

  const alignedProductionPixels = createAlignedPixelBuffer(
    productionPixels,
    workWidth,
    workHeight,
    bestOffset.offsetX,
    bestOffset.offsetY
  );

  const threshold = options.depth === "detailed" ? 30 : 42;
  const minPixels = options.depth === "detailed" ? 40 : 90;
  const maxResults = options.depth === "detailed" ? 35 : 16;

  const totalPixels = workWidth * workHeight;
  const mask = new Uint8Array(totalPixels);
  const visited = new Uint8Array(totalPixels);

  for (let i = 0, pixelIndex = 0; pixelIndex < totalPixels; i += 4, pixelIndex += 1) {
    const dr = Math.abs(figmaPixels[i] - alignedProductionPixels[i]);
    const dg = Math.abs(figmaPixels[i + 1] - alignedProductionPixels[i + 1]);
    const db = Math.abs(figmaPixels[i + 2] - alignedProductionPixels[i + 2]);
    const da = Math.abs(figmaPixels[i + 3] - alignedProductionPixels[i + 3]);

    const weightedDiff = dr * 0.34 + dg * 0.5 + db * 0.16 + da * 0.2;
    mask[pixelIndex] = weightedDiff > threshold ? 1 : 0;
  }

  const cleanedMask = cleanDiffMask(mask, workWidth, workHeight);

  const components: Array<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    pixels: number;
    meanDiff: number;
    avgDr: number;
    avgDg: number;
    avgDb: number;
    rejected?: string[];
  }> = [];

  const stack: number[] = [];

  for (let y = 0; y < workHeight; y += 1) {
    for (let x = 0; x < workWidth; x += 1) {
      const start = y * workWidth + x;
      if (!cleanedMask[start] || visited[start]) continue;

      visited[start] = 1;
      stack.push(start);

      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;
      let pixels = 0;
      let weightedDiffAccumulator = 0;
      let drAccumulator = 0;
      let dgAccumulator = 0;
      let dbAccumulator = 0;

      while (stack.length > 0) {
        const current = stack.pop() as number;
        const cx = current % workWidth;
        const cy = Math.floor(current / workWidth);

        minX = Math.min(minX, cx);
        minY = Math.min(minY, cy);
        maxX = Math.max(maxX, cx);
        maxY = Math.max(maxY, cy);
        pixels += 1;

        const i = current * 4;
        const dr = Math.abs(figmaPixels[i] - alignedProductionPixels[i]);
        const dg = Math.abs(figmaPixels[i + 1] - alignedProductionPixels[i + 1]);
        const db = Math.abs(figmaPixels[i + 2] - alignedProductionPixels[i + 2]);
        const da = Math.abs(figmaPixels[i + 3] - alignedProductionPixels[i + 3]);
        weightedDiffAccumulator += dr * 0.34 + dg * 0.5 + db * 0.16 + da * 0.2;
        drAccumulator += dr;
        dgAccumulator += dg;
        dbAccumulator += db;

        const neighbors = [
          current - 1,
          current + 1,
          current - workWidth,
          current + workWidth,
        ];

        for (let n = 0; n < neighbors.length; n += 1) {
          const next = neighbors[n];
          if (next < 0 || next >= totalPixels) continue;

          const nx = next % workWidth;
          const ny = Math.floor(next / workWidth);

          // Avoid horizontal wrap.
          if ((n === 0 || n === 1) && ny !== cy) continue;

          if (!cleanedMask[next] || visited[next]) continue;
          visited[next] = 1;
          stack.push(next);
        }
      }

      if (pixels < minPixels) continue;

      components.push({
        minX,
        minY,
        maxX,
        maxY,
        pixels,
        // Keep meanDiff on the same weighted per-pixel scale used for mask thresholding.
        meanDiff: weightedDiffAccumulator / Math.max(1, pixels),
        avgDr: drAccumulator / Math.max(1, pixels),
        avgDg: dgAccumulator / Math.max(1, pixels),
        avgDb: dbAccumulator / Math.max(1, pixels),
      });
    }
  }

  const iou = (
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ) => {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    const y2 = Math.min(a.y + a.height, b.y + b.height);
    const w = Math.max(0, x2 - x1);
    const h = Math.max(0, y2 - y1);
    const inter = w * h;
    if (!inter) return 0;
    const union = a.width * a.height + b.width * b.height - inter;
    return union > 0 ? inter / union : 0;
  };

  const scaleBack = 1 / downscale;
  const selectedArea = options.selectedArea;

  const candidates = components
    .map((comp, index) => {
      const width = Math.max(8, Math.round((comp.maxX - comp.minX + 1) * scaleBack));
      const height = Math.max(8, Math.round((comp.maxY - comp.minY + 1) * scaleBack));
      const x = Math.round(comp.minX * scaleBack);
      const y = Math.round(comp.minY * scaleBack);
      const normalizedX = x / Math.max(1, baseWidth);
      const normalizedY = y / Math.max(1, baseHeight);
      const normalizedWidth = width / Math.max(1, baseWidth);
      const normalizedHeight = height / Math.max(1, baseHeight);

      const productionX = Math.round(normalizedX * productionWidth);
      const productionY = Math.round(normalizedY * productionHeight);
      const productionBoxWidth = Math.max(8, Math.round(normalizedWidth * productionWidth));
      const productionBoxHeight = Math.max(8, Math.round(normalizedHeight * productionHeight));
      const compactness = comp.pixels / Math.max(1, (comp.maxX - comp.minX + 1) * (comp.maxY - comp.minY + 1));
      const aspectRatio = width / Math.max(1, height);
      const notes: string[] = [];

      // Reject common false positives from seam/edge artifacts.
      if (width < Math.max(12, Math.round(baseWidth * 0.014)) && height > Math.round(baseHeight * 0.12)) {
        notes.push("thin_tall_artifact");
      }
      if ((x < 3 || x + width > baseWidth - 3) && height > Math.round(baseHeight * 0.08)) {
        notes.push("edge_strip_artifact");
      }
      if (compactness < 0.1) {
        notes.push("sparse_component");
      }

      const centerX = x + width / 2;
      const centerY = y + height / 2;

      if (selectedArea && selectedArea.width > 0 && selectedArea.height > 0) {
        const withinSelection =
          centerX >= selectedArea.x &&
          centerX <= selectedArea.x + selectedArea.width &&
          centerY >= selectedArea.y &&
          centerY <= selectedArea.y + selectedArea.height;

        if (!withinSelection) {
          return null;
        }
      }

      // Keep hard rejection only for strong edge/seam artifact signatures.
      if (notes.includes("thin_tall_artifact") && notes.includes("edge_strip_artifact")) {
        return null;
      }

      const area = width * height;
      const confidence = Math.min(
        1,
        Math.max(
          0,
          ((comp.meanDiff - threshold) / 120) * 0.5 +
            Math.min(1, area / 50000) * 0.3 +
            compactness * 0.2
        )
      );

      const minConfidence = options.depth === "detailed" ? 0.12 : 0.2;
      // Allow larger regions to pass even at lower confidence so users still get actionable markers.
      if (confidence < minConfidence && area < 1200) {
        return null;
      }

      const severity: Discrepancy["severity"] =
        area > 28000 || comp.meanDiff > 145 || confidence > 0.9
          ? "high"
          : area > 10000 || comp.meanDiff > 95 || confidence > 0.65
          ? "medium"
          : "low";

      const channelSpread =
        Math.max(comp.avgDr, comp.avgDg, comp.avgDb) -
        Math.min(comp.avgDr, comp.avgDg, comp.avgDb);
      const colorRatio = channelSpread / Math.max(1, comp.meanDiff);
      const imageArea = Math.max(1, baseWidth * baseHeight);
      const areaRatio = area / imageArea;
      const elongation = Math.max(aspectRatio, 1 / Math.max(0.01, aspectRatio));

      const textLikeShape =
        width >= 10 &&
        height >= 6 &&
        height <= Math.max(90, Math.round(baseHeight * 0.08)) &&
        aspectRatio >= 1.1 &&
        aspectRatio <= 30 &&
        areaRatio <= 0.18;

      const spacingLikeShape =
        area >= 2200 &&
        (elongation >= 2.1 || compactness <= 0.2 || areaRatio >= 0.02);

      const colorLikeShape =
        comp.meanDiff >= 28 &&
        comp.meanDiff <= 150 &&
        area >= 200 &&
        (channelSpread >= 10 || colorRatio >= 0.2);

      const majorLikeShape =
        comp.meanDiff >= 95 || areaRatio >= 0.03 || area >= 12000;

      // Score each bucket and pick the strongest signal to avoid hard if/else bias.
      const textScore =
        (textLikeShape ? 0.52 : 0) +
        Math.min(0.24, Math.max(0, (0.16 - areaRatio) / 0.16) * 0.24) +
        Math.min(0.24, Math.max(0, (92 - comp.meanDiff) / 92) * 0.24);

      const spacingScore =
        (spacingLikeShape ? 0.48 : 0) +
        Math.min(0.3, Math.max(0, (elongation - 1.6) / 3.2) * 0.3) +
        Math.min(0.22, Math.max(0, (0.24 - compactness) / 0.24) * 0.22);

      const colorScore =
        (colorLikeShape ? 0.5 : 0) +
        Math.min(0.28, Math.max(0, (channelSpread - 8) / 30) * 0.28) +
        Math.min(0.22, Math.max(0, (0.52 - colorRatio) / 0.52) * 0.22);

      const majorScore =
        (majorLikeShape ? 0.46 : 0) +
        Math.min(0.32, Math.max(0, (comp.meanDiff - 78) / 92) * 0.32) +
        Math.min(0.22, Math.max(0, (areaRatio - 0.014) / 0.09) * 0.22);

      let reportingBucket: Discrepancy["reportingBucket"] = "major_visual_issues";
      let reportingReason = `Large visual mismatch (area ${width}x${height}, diff ${Math.round(comp.meanDiff)}).`;
      let type: Discrepancy["type"] = "missing";

      const rankedBuckets: Array<{
        bucket: Discrepancy["reportingBucket"];
        score: number;
      }> = [
        { bucket: "missing_text_elements", score: textScore },
        { bucket: "large_spacing_discrepancies", score: spacingScore },
        { bucket: "color_issues", score: colorScore },
        { bucket: "major_visual_issues", score: majorScore },
      ];

      rankedBuckets.sort((a, b) => b.score - a.score);
      reportingBucket = rankedBuckets[0].bucket;

      if (reportingBucket === "color_issues") {
        reportingReason = `Color delta in region (RGB Δ ${Math.round(comp.avgDr)}/${Math.round(comp.avgDg)}/${Math.round(comp.avgDb)}).`;
        type = "color";
      } else if (reportingBucket === "missing_text_elements") {
        reportingReason = `Text-like region differs (${width}x${height}, diff ${Math.round(comp.meanDiff)}).`;
        type = "content";
      } else if (reportingBucket === "large_spacing_discrepancies") {
        reportingReason = `Spacing/layout changed (${width}x${height}, aspect ${aspectRatio.toFixed(2)}).`;
        type = "spacing";
      } else {
        reportingReason = `Major visual difference detected.`;
        type = "missing";
      }

      return {
        id: `auto-${Date.now()}-${index}`,
        type,
        severity,
        description:
          reportingReason,
        location: { x: clamp(productionX, 0, productionWidth - 1), y: clamp(productionY, 0, productionHeight - 1) },
        productionLocation: { x: clamp(productionX, 0, productionWidth - 1), y: clamp(productionY, 0, productionHeight - 1) },
        figmaLocation: { x: clamp(x, 0, baseWidth - 1), y: clamp(y, 0, baseHeight - 1) },
        area: {
          width: clamp(productionBoxWidth, 8, productionWidth),
          height: clamp(productionBoxHeight, 8, productionHeight),
        },
        productionArea: {
          width: clamp(productionBoxWidth, 8, productionWidth),
          height: clamp(productionBoxHeight, 8, productionHeight),
        },
        figmaArea: {
          width: clamp(width, 8, baseWidth),
          height: clamp(height, 8, baseHeight),
        },
        source: "auto",
        reportingBucket,
        reportingReason,
        detectionDetails: {
          confidence: Number(confidence.toFixed(3)),
          pixelCount: comp.pixels,
          meanDiff: Number(comp.meanDiff.toFixed(2)),
          compactness: Number(compactness.toFixed(3)),
          filterNotes: [
            `alignment_offset(${bestOffset.offsetX},${bestOffset.offsetY})`,
            "morphology_open_close",
            ...(notes.length > 0 ? notes : []),
          ],
          avgChannelDelta: {
            r: Number(comp.avgDr.toFixed(2)),
            g: Number(comp.avgDg.toFixed(2)),
            b: Number(comp.avgDb.toFixed(2)),
          },
        },
      } satisfies Discrepancy;
    })
    .filter((item): item is Discrepancy => item !== null)
    .sort((a, b) => {
      const scoreA = (a.detectionDetails?.confidence || 0) * ((a.area?.width || 0) * (a.area?.height || 0));
      const scoreB = (b.detectionDetails?.confidence || 0) * ((b.area?.width || 0) * (b.area?.height || 0));
      return scoreB - scoreA;
    });

  const deduped: Discrepancy[] = [];
  for (const candidate of candidates) {
    const box = {
      x: candidate.location.x,
      y: candidate.location.y,
      width: candidate.area?.width || 8,
      height: candidate.area?.height || 8,
    };

    const overlaps = deduped.some(existing => {
      const existingBox = {
        x: existing.location.x,
        y: existing.location.y,
        width: existing.area?.width || 8,
        height: existing.area?.height || 8,
      };
      return iou(box, existingBox) > 0.42;
    });

    if (!overlaps) {
      deduped.push(candidate);
    }

    if (deduped.length >= maxResults) break;
  }

  return deduped;
}
