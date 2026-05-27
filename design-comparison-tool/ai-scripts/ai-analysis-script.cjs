#!/usr/bin/env node
/**
 * AI Vision Analysis Script for Design Comparison Tool
 * 
 * This script performs AI-powered visual comparison between Figma designs
 * and production screenshots, generating a JSON file that can be imported
 * into the Design Comparison Tool.
 * 
 * Usage:
 *   node ai-analysis-script.cjs --figma design.png --production prod.png --output discrepancies.json
 * 
 * Requirements:
 *   npm install @anthropic-ai/sdk
 * 
 * Set your API key as an environment variable:
 *   export ANTHROPIC_API_KEY="your-key-here"
 */

const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i++;
      }
    }
  }
  
  return parsed;
}

function stripMarkdownCodeFences(content) {
  let text = String(content || '').trim();
  if (text.startsWith('```json')) {
    text = text.substring(7);
  }
  if (text.startsWith('```')) {
    text = text.substring(3);
  }
  if (text.endsWith('```')) {
    text = text.substring(0, text.length - 3);
  }
  return text.trim();
}

function tryParseJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function repairJsonWithClaude(client, invalidJsonText) {
  const repairPrompt = `Repair the following text so it is valid JSON.
Return ONLY valid JSON.

Required top-level format:
{
  "discrepancies": []
}

Text to repair:
${invalidJsonText}`;

  const repairMessage = await client.messages.create({
    model: 'claude-opus-4-1',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: repairPrompt }
        ]
      }
    ]
  });

  return stripMarkdownCodeFences(repairMessage.content?.[0]?.text || '');
}

// Encode image to base64
function encodeImageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Get image MIME type
function getImageMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif'
  };
  return mimeTypes[ext] || 'image/png';
}

// Get image dimensions from file headers (supports PNG, JPEG, GIF)
function getImageDimensions(imagePath) {
  const buffer = fs.readFileSync(imagePath);

  // PNG
  if (
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }

  // JPEG
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);

      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }

      if (length < 2) break;
      offset += 2 + length;
    }
  }

  // GIF
  if (
    buffer.length >= 10 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  ) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8)
    };
  }

  return null;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

// Compute pixel-level differences between two image regions
async function computeDifferenceMap(figmaImagePath, productionImagePath) {
  try {
    console.log('  Computing pixel difference map...');
    const figmaImage = await Jimp.read(figmaImagePath);
    const prodImage = await Jimp.read(productionImagePath);

    const figmaWidth = figmaImage.width;
    const figmaHeight = figmaImage.height;
    const prodWidth = prodImage.width;
    const prodHeight = prodImage.height;

    // Create a difference map scaled to Figma image dimensions
    const diffMap = new Array(figmaHeight);
    for (let y = 0; y < figmaHeight; y++) {
      diffMap[y] = new Array(figmaWidth);
      for (let x = 0; x < figmaWidth; x++) {
        // Scale coordinates to production image space
        const prodX = Math.round((x / figmaWidth) * prodWidth);
        const prodY = Math.round((y / figmaHeight) * prodHeight);

        // Clamp to valid ranges
        const px = Math.max(0, Math.min(prodX, prodWidth - 1));
        const py = Math.max(0, Math.min(prodY, prodHeight - 1));

        // Get pixel colors (Jimp stores as 32-bit RGBA)
        const figmaPixel = figmaImage.getPixelColor(x, y);
        const prodPixel = prodImage.getPixelColor(px, py);

        // Extract RGBA components (big-endian format)
        const fR = (figmaPixel >>> 24) & 0xff;
        const fG = (figmaPixel >>> 16) & 0xff;
        const fB = (figmaPixel >>> 8) & 0xff;
        const fA = figmaPixel & 0xff;

        const pR = (prodPixel >>> 24) & 0xff;
        const pG = (prodPixel >>> 16) & 0xff;
        const pB = (prodPixel >>> 8) & 0xff;
        const pA = prodPixel & 0xff;

        const dR = fR - pR;
        const dG = fG - pG;
        const dB = fB - pB;
        const dA = fA - pA;

        const distance = Math.sqrt(dR * dR + dG * dG + dB * dB + dA * dA);
        diffMap[y][x] = distance;
      }
    }

    return { diffMap, figmaWidth, figmaHeight };
  } catch (error) {
    console.warn('  Warning: Could not compute difference map:', error.message);
    return null;
  }
}

// Find the region of maximum difference around a given point
function refineCoordinatesWithDiffMap(diffMap, figmaWidth, figmaHeight, aiX, aiY, aiWidth, aiHeight) {
  if (!diffMap) return null;

  // Search window: expand around AI estimate with modest radius
  const searchRadius = Math.max(aiWidth, aiHeight) * 0.5; // 50% expansion, not 100%
  const minX = Math.max(0, aiX - searchRadius);
  const maxX = Math.min(figmaWidth - 1, aiX + aiWidth + searchRadius);
  const minY = Math.max(0, aiY - searchRadius);
  const maxY = Math.min(figmaHeight - 1, aiY + aiHeight + searchRadius);

  // Find pixel with max difference in search window
  let maxDiff = 0;
  let maxX_px = aiX;
  let maxY_px = aiY;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const diff = diffMap[y] ? diffMap[y][x] : 0;
      if (diff > maxDiff) {
        maxDiff = diff;
        maxX_px = x;
        maxY_px = y;
      }
    }
  }

  // Use higher threshold to avoid capturing too much area (70% instead of 30%)
  const threshold = maxDiff * 0.7;
  let regionMinX = maxX_px;
  let regionMaxX = maxX_px;
  let regionMinY = maxY_px;
  let regionMaxY = maxY_px;

  // Expand from peak outward, but stay within search window
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const diff = diffMap[y] ? diffMap[y][x] : 0;
      if (diff >= threshold) {
        regionMinX = Math.min(regionMinX, x);
        regionMaxX = Math.max(regionMaxX, x);
        regionMinY = Math.min(regionMinY, y);
        regionMaxY = Math.max(regionMaxY, y);
      }
    }
  }

  // Compute detected region
  const detectedWidth = regionMaxX - regionMinX + 1;
  const detectedHeight = regionMaxY - regionMinY + 1;

  // Constrain result to be reasonable: keep within 1.5-2x of AI estimate size
  // and don't drift too far from the AI estimate center
  const maxAllowedWidth = aiWidth * 2;
  const maxAllowedHeight = aiHeight * 2;
  const minAllowedWidth = Math.max(aiWidth * 0.7, 8);
  const minAllowedHeight = Math.max(aiHeight * 0.7, 8);

  const constrainedWidth = Math.max(
    minAllowedWidth,
    Math.min(maxAllowedWidth, detectedWidth)
  );
  const constrainedHeight = Math.max(
    minAllowedHeight,
    Math.min(maxAllowedHeight, detectedHeight)
  );

  // Center the constrained region on the detected peak
  const cvX = Math.max(0, Math.min(
    figmaWidth - constrainedWidth,
    maxX_px - constrainedWidth / 2
  ));
  const cvY = Math.max(0, Math.min(
    figmaHeight - constrainedHeight,
    maxY_px - constrainedHeight / 2
  ));

  return {
    cvLocation: { x: Math.round(cvX), y: Math.round(cvY) },
    cvArea: { width: Math.round(constrainedWidth), height: Math.round(constrainedHeight) },
    cvConfidence: Math.min(1, maxDiff / 255) // Normalized to 0-1
  };
}

// Refine all discrepancies using computer vision
async function refineDiscrepanciesWithCV(result, figmaImagePath, productionImagePath) {
  try {
    const diffData = await computeDifferenceMap(figmaImagePath, productionImagePath);
    if (!diffData) return result;

    const { diffMap, figmaWidth, figmaHeight } = diffData;

    result.discrepancies = result.discrepancies.map(discrepancy => {
      const aiX = Number(discrepancy?.figmaLocation?.x ?? discrepancy?.location?.x) || 0;
      const aiY = Number(discrepancy?.figmaLocation?.y ?? discrepancy?.location?.y) || 0;
      const aiWidth = Number(discrepancy?.figmaArea?.width ?? discrepancy?.area?.width) || 60;
      const aiHeight = Number(discrepancy?.figmaArea?.height ?? discrepancy?.area?.height) || 40;

      const refinement = refineCoordinatesWithDiffMap(diffMap, figmaWidth, figmaHeight, aiX, aiY, aiWidth, aiHeight);

      if (refinement) {
        return {
          ...discrepancy,
          cvLocation: refinement.cvLocation,
          cvArea: refinement.cvArea,
          cvConfidence: refinement.cvConfidence
        };
      }
      return discrepancy;
    });

    result.computationMethod = 'ai+cv-refinement';
    result.cvRefinementApplied = true;

    console.log('  ✓ CV refinement complete');
    return result;
  } catch (error) {
    console.warn('  Warning: CV refinement failed:', error.message);
    return result;
  }
}

function enrichWithNormalizedCoordinates(result, imageDimensions, productionDimensions) {
  const width = imageDimensions?.width || 1;
  const height = imageDimensions?.height || 1;
  const productionWidth = productionDimensions?.width || width;
  const productionHeight = productionDimensions?.height || height;
  const discrepancies = Array.isArray(result?.discrepancies) ? result.discrepancies : [];

  return {
    imageSpace: {
      figma: {
        width,
        height,
      },
      production: {
        width: productionWidth,
        height: productionHeight,
      },
      coordinateSystem: 'figma-first-image',
      locationAnchor: 'top-left'
    },
    discrepancies: discrepancies.map((item) => {
      const figmaX = Number(item?.figmaLocation?.x ?? item?.location?.x) || 0;
      const figmaY = Number(item?.figmaLocation?.y ?? item?.location?.y) || 0;
      const figmaAreaWidth = Number(item?.figmaArea?.width ?? item?.area?.width) || 60;
      const figmaAreaHeight = Number(item?.figmaArea?.height ?? item?.area?.height) || 40;

      const productionXRaw = Number(item?.productionLocation?.x);
      const productionYRaw = Number(item?.productionLocation?.y);
      const productionAreaWidthRaw = Number(item?.productionArea?.width);
      const productionAreaHeightRaw = Number(item?.productionArea?.height);

      const likelyMissingInProduction =
        String(item?.type || '').toLowerCase() === 'missing' &&
        (String(item?.productionValue || '').toLowerCase().includes('missing') || !item?.productionValue);

      const hasInvalidProductionAnchor =
        Number.isFinite(productionXRaw) &&
        Number.isFinite(productionYRaw) &&
        productionXRaw <= 1 &&
        productionYRaw <= 1 &&
        likelyMissingInProduction;

      const safeX = clamp(figmaX, 0, Math.max(0, width - 1));
      const safeY = clamp(figmaY, 0, Math.max(0, height - 1));
      const safeAreaWidth = clamp(figmaAreaWidth, 8, width);
      const safeAreaHeight = clamp(figmaAreaHeight, 8, height);

      const figmaZoneWidth = Math.min(safeAreaWidth, Math.max(8, width - safeX));
      const figmaZoneHeight = Math.min(safeAreaHeight, Math.max(8, height - safeY));

      const fallbackProdX = (safeX / width) * productionWidth;
      const fallbackProdY = (safeY / height) * productionHeight;
      const fallbackProdW = (figmaZoneWidth / width) * productionWidth;
      const fallbackProdH = (figmaZoneHeight / height) * productionHeight;

      const safeProdX = clamp(
        Number.isFinite(productionXRaw) && !hasInvalidProductionAnchor ? productionXRaw : fallbackProdX,
        0,
        Math.max(0, productionWidth - 1)
      );
      const safeProdY = clamp(
        Number.isFinite(productionYRaw) && !hasInvalidProductionAnchor ? productionYRaw : fallbackProdY,
        0,
        Math.max(0, productionHeight - 1)
      );
      const safeProdW = clamp(
        Number.isFinite(productionAreaWidthRaw) ? productionAreaWidthRaw : fallbackProdW,
        8,
        productionWidth
      );
      const safeProdH = clamp(
        Number.isFinite(productionAreaHeightRaw) ? productionAreaHeightRaw : fallbackProdH,
        8,
        productionHeight
      );

      const productionZoneWidth = Math.min(safeProdW, Math.max(8, productionWidth - safeProdX));
      const productionZoneHeight = Math.min(safeProdH, Math.max(8, productionHeight - safeProdY));

      return {
        ...item,
        location: {
          x: Math.round(safeX),
          y: Math.round(safeY)
        },
        figmaLocation: {
          x: Math.round(safeX),
          y: Math.round(safeY)
        },
        productionLocation: {
          x: Math.round(safeProdX),
          y: Math.round(safeProdY)
        },
        area: {
          width: Math.round(figmaZoneWidth),
          height: Math.round(figmaZoneHeight)
        },
        figmaArea: {
          width: Math.round(figmaZoneWidth),
          height: Math.round(figmaZoneHeight)
        },
        productionArea: {
          width: Math.round(productionZoneWidth),
          height: Math.round(productionZoneHeight)
        },
        locationNormalized: {
          x: Number((safeX / width).toFixed(6)),
          y: Number((safeY / height).toFixed(6))
        },
        areaNormalized: {
          width: Number((figmaZoneWidth / width).toFixed(6)),
          height: Number((figmaZoneHeight / height).toFixed(6))
        },
        productionLocationNormalized: {
          x: Number((safeProdX / productionWidth).toFixed(6)),
          y: Number((safeProdY / productionHeight).toFixed(6))
        },
        productionAreaNormalized: {
          width: Number((productionZoneWidth / productionWidth).toFixed(6)),
          height: Number((productionZoneHeight / productionHeight).toFixed(6))
        },
        locationAnchor: 'top-left'
      };
    })
  };
}

// Analyze with OpenAI
async function analyzeWithOpenAI(figmaPath, productionPath, apiKey) {
  let OpenAI;
  try {
    OpenAI = require('openai').default;
  } catch (err) {
    console.error('Error: OpenAI package not installed. Run: npm install openai');
    process.exit(1);
  }

  const client = new OpenAI({ apiKey });

  const figmaB64 = encodeImageToBase64(figmaPath);
  const prodB64 = encodeImageToBase64(productionPath);
  const figmaMime = getImageMimeType(figmaPath);
  const prodMime = getImageMimeType(productionPath);
  const figmaDimensions = getImageDimensions(figmaPath);

  const prompt = `You are a precise design comparison expert. Compare these two images:
1. Figma Design (first image)
2. Production Implementation (second image)

Analyze and identify ALL visual discrepancies between them. For each discrepancy found, provide:
- type: one of [color, spacing, typography, size, border, alignment, padding, margin, line-height, missing, formatting]
- severity: one of [high, medium, low]
- description: clear explanation of the issue
- figmaLocation: {x, y} coordinates in pixels in FIRST image (Figma), top-left of discrepancy area
- productionLocation: {x, y} coordinates in pixels in SECOND image (Production), top-left of discrepancy area
- figmaArea: {width, height} area size in pixels for FIRST image
- productionArea: {width, height} area size in pixels for SECOND image
- location: legacy alias of figmaLocation
- area: legacy alias of figmaArea
- locationNormalized: {x, y} in 0..1 relative to FIRST image dimensions
- areaNormalized: {width, height} in 0..1 relative to FIRST image dimensions
- productionLocationNormalized: {x, y} in 0..1 relative to SECOND image dimensions
- productionAreaNormalized: {width, height} in 0..1 relative to SECOND image dimensions
- locationAnchor: must be "top-left"
- figmaValue: what the design shows (optional)
- productionValue: what production shows (optional)

Focus on:
- Color differences (backgrounds, text, borders)
- Spacing issues (padding, margins, gaps)
- Typography (font family, size, weight, line-height)
- Missing elements (icons, images, text)
- Size/dimension differences
- Border and radius variations
- Alignment issues

Return ONLY a valid JSON object in this exact format:
{
  "discrepancies": [
    {
      "type": "color",
      "severity": "high",
      "description": "Button background color mismatch",
      "location": {"x": 120, "y": 85},
      "figmaLocation": {"x": 120, "y": 85},
      "productionLocation": {"x": 118, "y": 82},
      "area": {"width": 100, "height": 40},
      "figmaArea": {"width": 100, "height": 40},
      "productionArea": {"width": 100, "height": 40},
      "locationNormalized": {"x": 0.09375, "y": 0.0455},
      "areaNormalized": {"width": 0.078125, "height": 0.0214},
      "productionLocationNormalized": {"x": 0.092, "y": 0.044},
      "productionAreaNormalized": {"width": 0.078, "height": 0.021},
      "locationAnchor": "top-left",
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    }
  ]
}

If the images are identical or nearly identical, return {"discrepancies": []}.

Reference image (FIRST image) dimensions:
- width: ${figmaDimensions?.width || 'unknown'}
- height: ${figmaDimensions?.height || 'unknown'}

All coordinates must stay inside these first-image bounds.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:${figmaMime};base64,${figmaB64}`,
              detail: 'high'
            }
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${prodMime};base64,${prodB64}`,
              detail: 'high'
            }
          }
        ]
      }
    ],
    max_tokens: 4000,
    temperature: 0.1
  });

  let content = response.choices[0].message.content.trim();
  
  // Remove markdown code blocks if present
  if (content.startsWith('```json')) {
    content = content.substring(7);
  }
  if (content.startsWith('```')) {
    content = content.substring(3);
  }
  if (content.endsWith('```')) {
    content = content.substring(0, content.length - 3);
  }
  content = content.trim();

  return JSON.parse(content);
}

// Analyze with Anthropic
async function analyzeWithAnthropic(figmaPath, productionPath, apiKey) {
  let Anthropic;
  try {
    Anthropic = require('@anthropic-ai/sdk').default;
  } catch (err) {
    console.error('Error: Anthropic package not installed. Run: npm install @anthropic-ai/sdk');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const figmaB64 = encodeImageToBase64(figmaPath);
  const prodB64 = encodeImageToBase64(productionPath);
  const figmaMime = getImageMimeType(figmaPath);
  const prodMime = getImageMimeType(productionPath);
  const figmaDimensions = getImageDimensions(figmaPath);

  const prompt = `You are a precise design comparison expert. Compare these two images:
1. Figma Design (first image)
2. Production Implementation (second image)

Analyze and identify ALL visual discrepancies between them. For each discrepancy found, provide:
- type: one of [color, spacing, typography, size, border, alignment, padding, margin, line-height, missing, formatting]
- severity: one of [high, medium, low]
- description: clear explanation of the issue
- figmaLocation: {x, y} coordinates in pixels in FIRST image (Figma), top-left of discrepancy area
- productionLocation: {x, y} coordinates in pixels in SECOND image (Production), top-left of discrepancy area
- figmaArea: {width, height} area size in pixels for FIRST image
- productionArea: {width, height} area size in pixels for SECOND image
- location: legacy alias of figmaLocation
- area: legacy alias of figmaArea
- locationNormalized: {x, y} in 0..1 relative to FIRST image dimensions
- areaNormalized: {width, height} in 0..1 relative to FIRST image dimensions
- productionLocationNormalized: {x, y} in 0..1 relative to SECOND image dimensions
- productionAreaNormalized: {width, height} in 0..1 relative to SECOND image dimensions
- locationAnchor: must be "top-left"
- figmaValue: what the design shows (optional)
- productionValue: what production shows (optional)

Focus on:
- Color differences (backgrounds, text, borders)
- Spacing issues (padding, margins, gaps)
- Typography (font family, size, weight, line-height)
- Missing elements (icons, images, text)
- Size/dimension differences
- Border and radius variations
- Alignment issues

Return ONLY a valid JSON object in this exact format:
{
  "discrepancies": [
    {
      "type": "color",
      "severity": "high",
      "description": "Button background color mismatch",
      "location": {"x": 120, "y": 85},
      "figmaLocation": {"x": 120, "y": 85},
      "productionLocation": {"x": 118, "y": 82},
      "area": {"width": 100, "height": 40},
      "figmaArea": {"width": 100, "height": 40},
      "productionArea": {"width": 100, "height": 40},
      "locationNormalized": {"x": 0.09375, "y": 0.0455},
      "areaNormalized": {"width": 0.078125, "height": 0.0214},
      "productionLocationNormalized": {"x": 0.092, "y": 0.044},
      "productionAreaNormalized": {"width": 0.078, "height": 0.021},
      "locationAnchor": "top-left",
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    }
  ]
}

If the images are identical or nearly identical, return {"discrepancies": []}.

Reference image (FIRST image) dimensions:
- width: ${figmaDimensions?.width || 'unknown'}
- height: ${figmaDimensions?.height || 'unknown'}

All coordinates must stay inside these first-image bounds.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-1',
    temperature: 0,
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: figmaMime,
              data: figmaB64
            }
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: prodMime,
              data: prodB64
            }
          },
          { type: 'text', text: prompt }
        ]
      }
    ]
  });

  const rawContent = message.content?.[0]?.text || '';
  const stripped = stripMarkdownCodeFences(rawContent);
  const parsed = tryParseJson(stripped);
  if (parsed) {
    return parsed;
  }

  console.warn('  Warning: model returned invalid JSON, attempting repair pass...');
  const repaired = await repairJsonWithClaude(client, stripped);
  const repairedParsed = tryParseJson(repaired);
  if (!repairedParsed) {
    throw new Error('Claude response could not be parsed as JSON after repair pass');
  }

  return repairedParsed;
}

// Main function
async function main() {
  const args = parseArgs();

  if (!args.figma || !args.production) {
    console.error('Usage: node ai-analysis-script.cjs --figma <path> --production <path> [--output <path>] [--provider anthropic] [--api-key <key>] [--cv-refine true|false] [--allow-drop true|false]');
    process.exit(1);
  }

  const figmaPath = args.figma;
  const productionPath = args.production;
  const outputPath = args.output || 'discrepancies.json';
  const provider = args.provider || 'anthropic';
  const cvRefine = String(args['cv-refine'] || 'false').toLowerCase() === 'true';
  const allowDrop = String(args['allow-drop'] || 'false').toLowerCase() === 'true';
  let apiKey = args['api-key'];

  if (provider !== 'anthropic') {
    console.error('Error: Only provider "anthropic" is supported in lightweight mode.');
    process.exit(1);
  }

  // Validate input files
  if (!fs.existsSync(figmaPath)) {
    console.error(`Error: Figma image not found: ${figmaPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(productionPath)) {
    console.error(`Error: Production image not found: ${productionPath}`);
    process.exit(1);
  }

  // Get API key from environment if not provided
  if (!apiKey) {
    apiKey = process.env.ANTHROPIC_API_KEY;
  }

  if (!apiKey) {
    console.error(`Error: API key not provided. Set ${provider.toUpperCase()}_API_KEY environment variable or use --api-key`);
    process.exit(1);
  }

  console.log('Analyzing images with ANTHROPIC...');
  console.log(`  Figma: ${figmaPath}`);
  console.log(`  Production: ${productionPath}`);
  console.log(`  CV refinement: ${cvRefine ? 'on' : 'off'}`);
  if (cvRefine) {
    console.log(`  Allow discrepancy drop: ${allowDrop ? 'yes' : 'no'}`);
  }

  try {
    let result = await analyzeWithAnthropic(figmaPath, productionPath, apiKey);

    if (!result || !Array.isArray(result.discrepancies)) {
      result = { discrepancies: [] };
    }

    const figmaDimensions = getImageDimensions(figmaPath);
    const productionDimensions = getImageDimensions(productionPath);
    result = enrichWithNormalizedCoordinates(result, figmaDimensions, productionDimensions);

    // Apply computer vision refinement only when explicitly enabled.
    if (cvRefine) {
      const baselineDiscrepancies = Array.isArray(result.discrepancies)
        ? result.discrepancies.map((item) => ({ ...item }))
        : [];

      result = await refineDiscrepanciesWithCV(result, figmaPath, productionPath);

      // Safety guard: CV refinement must not reduce discrepancy count unless explicitly requested.
      if (!allowDrop && Array.isArray(result.discrepancies) && result.discrepancies.length < baselineDiscrepancies.length) {
        console.warn(
          `  Warning: CV refinement reduced discrepancy count from ${baselineDiscrepancies.length} to ${result.discrepancies.length}. Restoring missing entries.`
        );

        const merged = baselineDiscrepancies.map((baseItem, index) => {
          const refinedItem = result.discrepancies[index];
          return refinedItem ? { ...baseItem, ...refinedItem } : baseItem;
        });

        result.discrepancies = merged;
      }
    }

    // Write results
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    const numDiscrepancies = result.discrepancies?.length || 0;
    console.log(`\n✓ Analysis complete!`);
    console.log(`  Found ${numDiscrepancies} discrepancies`);
    console.log(`  Saved to: ${outputPath}`);
    console.log(`\nImport this file into the Design Comparison Tool using 'Import JSON'`);

  } catch (error) {
    console.error(`\n✗ Error during analysis: ${error.message}`);
    process.exit(1);
  }
}

main();
