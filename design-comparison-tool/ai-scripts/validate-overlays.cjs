const fs = require('fs');
const { Jimp, rgbaToInt } = require('jimp');

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function drawRect(img, x, y, w, h, color) {
  const x0 = clamp(Math.round(x), 0, img.bitmap.width - 1);
  const y0 = clamp(Math.round(y), 0, img.bitmap.height - 1);
  const x1 = clamp(Math.round(x + w), 0, img.bitmap.width - 1);
  const y1 = clamp(Math.round(y + h), 0, img.bitmap.height - 1);

  for (let px = x0; px <= x1; px++) {
    img.setPixelColor(color, px, y0);
    img.setPixelColor(color, px, y1);
  }
  for (let py = y0; py <= y1; py++) {
    img.setPixelColor(color, x0, py);
    img.setPixelColor(color, x1, py);
  }
}

function drawCross(img, cx, cy, size, color) {
  const x = Math.round(cx);
  const y = Math.round(cy);
  for (let d = -size; d <= size; d++) {
    const px = clamp(x + d, 0, img.bitmap.width - 1);
    const py = clamp(y + d, 0, img.bitmap.height - 1);
    const py2 = clamp(y - d, 0, img.bitmap.height - 1);
    img.setPixelColor(color, px, py);
    img.setPixelColor(color, px, py2);
  }
}

function pickColors(i) {
  const palette = [
    rgbaToInt(255, 0, 0, 255),
    rgbaToInt(0, 170, 255, 255),
    rgbaToInt(255, 180, 0, 255),
    rgbaToInt(0, 220, 120, 255),
    rgbaToInt(200, 0, 255, 255),
  ];
  return palette[i % palette.length];
}

async function annotate(baseImgPath, jsonPath, outputPath, mode) {
  const img = await Jimp.read(baseImgPath);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const list = Array.isArray(data.discrepancies) ? data.discrepancies : [];

  list.forEach((d, i) => {
    const color = pickColors(i);

    let loc;
    let area;
    if (mode === 'cv') {
      loc = d.cvLocation || d.figmaLocation || d.location || { x: 0, y: 0 };
      area = d.cvArea || d.figmaArea || d.area || { width: 20, height: 20 };
    } else {
      loc = d.figmaLocation || d.location || { x: 0, y: 0 };
      area = d.figmaArea || d.area || { width: 20, height: 20 };
    }

    drawRect(img, loc.x, loc.y, area.width, area.height, color);
    drawCross(img, loc.x + area.width / 2, loc.y + area.height / 2, 6, color);
  });

  await img.write(outputPath);
}

(async () => {
  await annotate('Figma-claimaint.png', 'discrepancies.json', 'validation-figma-base.png', 'base');
  await annotate('Figma-claimaint.png', 'discrepancies-cv.json', 'validation-figma-cv.png', 'cv');
  await annotate('Prod-Claimaint.png', 'discrepancies.json', 'validation-prod-base.png', 'base');
  await annotate('Prod-Claimaint.png', 'discrepancies-cv.json', 'validation-prod-cv.png', 'cv');
  console.log('Wrote validation overlays');
})();
