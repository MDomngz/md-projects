# Local Setup Guide - Lightweight Claude Discrepancy Tool

This setup is intentionally minimal: compare two images with Claude Vision and output marker-ready discrepancy JSON.

## Prerequisites

- Node.js 18+
- npm
- Anthropic API key

## 1. Install Dependencies

```bash
npm install --prefix ai-scripts
```

## 2. Set API Key

macOS/Linux:

```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Windows Command Prompt:

```bash
set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Windows PowerShell:

```bash
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Use environment variables only. Avoid passing API keys on the command line.

## 3. Run Analysis (Claude Only)

From the workspace root:

```bash
cd ai-scripts
node ai-analysis-script.cjs \
  --figma path/to/figma-design.png \
  --production path/to/production-screenshot.png \
  --provider anthropic \
  --output discrepancies.json
```

Optional: enable CV coordinate refinement (slower, usually more precise boxes):

```bash
node ai-analysis-script.cjs \
  --figma path/to/figma-design.png \
  --production path/to/production-screenshot.png \
  --provider anthropic \
  --cv-refine true \
  --output discrepancies.json
```

## Output

The script writes JSON with a `discrepancies` array. This file is ready to import into the app’s discrepancy manager.

## Import Into Web Tool

1. Open the Design Comparison Tool.
2. Upload Figma and Production images.
3. In Discrepancy Manager, click Import JSON.
4. Select the generated `discrepancies.json`.

## Troubleshooting

### Error: API key not provided

Ensure `ANTHROPIC_API_KEY` is set in the same shell session where you run the script.

### Error: image not found

Verify paths passed to `--figma` and `--production`.

### Invalid JSON from model

The script includes an automatic repair pass. If it still fails, rerun once and verify input images are clear and high resolution.

## Best Practices

1. Use PNGs when possible.
2. Keep both screenshots full-page and uncropped.
3. Use similar viewport widths between design and production images.
4. Start without `--cv-refine`; only enable it if box precision needs improvement.
