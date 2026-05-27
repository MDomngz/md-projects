# AI Vision Analysis - Design Comparison Tool

## Overview

The Design Comparison Tool now supports **AI-powered automatic discrepancy detection** using GPT-4 Vision or Claude Vision APIs. However, due to browser CORS restrictions, direct API calls from the frontend are blocked.

## 🚨 CORS Issue

When you try to use the built-in AI analysis feature in the web app, you'll get a **"Failed to fetch"** error. This is because:

- Browsers block cross-origin API requests for security
- OpenAI and Anthropic APIs don't allow direct browser calls
- This is a fundamental browser security feature (CORS)

## ✅ Solution: Use Local Scripts

We provide **two command-line scripts** that bypass CORS by running locally on your machine:

### 1. Python Script (`ai-analysis-script.py`)

**Requirements:**
```bash
pip install openai pillow
# OR
pip install anthropic pillow
```

**Setup:**
```bash
# Set your API key
export OPENAI_API_KEY="sk-..."
# OR
export ANTHROPIC_API_KEY="sk-ant-..."
```

**Usage:**
```bash
# Using OpenAI GPT-4 Vision
python ai-analysis-script.py \
  --figma design.png \
  --production screenshot.png \
  --output discrepancies.json

# Using Claude Vision
python ai-analysis-script.py \
  --figma design.png \
  --production screenshot.png \
  --provider anthropic \
  --output discrepancies.json
```

### 2. Node.js Script (`ai-analysis-script.js`)

**Requirements:**
```bash
npm install openai
# OR
npm install @anthropic-ai/sdk
```

**Setup:**
```bash
# Set your API key
export OPENAI_API_KEY="sk-..."
# OR
export ANTHROPIC_API_KEY="sk-ant-..."
```

**Usage:**
```bash
# Using OpenAI GPT-4 Vision
node ai-analysis-script.js \
  --figma design.png \
  --production screenshot.png \
  --output discrepancies.json

# Using Claude Vision
node ai-analysis-script.js \
  --figma design.png \
  --production screenshot.png \
  --provider anthropic \
  --output discrepancies.json
```

## 📥 Import Results

After running the script:

1. You'll get a `discrepancies.json` file
2. Open the Design Comparison Tool in your browser
3. Upload your Figma design and production screenshot
4. Click **"Import JSON"** in the Discrepancy Manager section
5. Select the generated `discrepancies.json` file
6. All AI-detected discrepancies will appear as markers!

## 🔑 Getting API Keys

### OpenAI (GPT-4 Vision)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and save it securely
4. **Cost**: ~$0.01-0.05 per comparison (depending on image size)

### Anthropic (Claude 3.5 Sonnet)
1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key
3. Copy and save it securely
4. **Cost**: ~$0.01-0.04 per comparison (depending on image size)

## 📊 Output Format

The scripts generate JSON in this format:

```json
{
  "discrepancies": [
    {
      "type": "color",
      "severity": "high",
      "description": "Button background color mismatch",
      "location": { "x": 120, "y": 85 },
      "area": { "width": 100, "height": 40 },
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    },
    {
      "type": "spacing",
      "severity": "medium",
      "description": "Increased padding around header text",
      "location": { "x": 50, "y": 30 },
      "area": { "width": 300, "height": 60 },
      "figmaValue": "16px",
      "productionValue": "24px"
    }
  ]
}
```

## 🎯 Supported Discrepancy Types

The AI can detect:

- **color** - Color differences (backgrounds, text, borders)
- **spacing** - Spacing issues (padding, margins, gaps)
- **typography** - Font family, size, weight, line-height
- **size** - Element dimension differences
- **border** - Border width, style, radius variations
- **alignment** - Alignment and positioning issues
- **missing** - Missing elements (icons, images, text)
- **formatting** - Other formatting differences

## 💡 Tips for Best Results

1. **Image Quality**: Use high-resolution screenshots (PNG recommended)
2. **Consistent Size**: Make sure both images are the same size
3. **Clear Differences**: AI works best with visible differences
4. **Crop Wisely**: Focus on specific areas for more detailed analysis
5. **Review Results**: AI isn't perfect - review and edit markers as needed

## 🔧 Alternative: Backend Proxy

If you want to use AI analysis directly in the browser, you need a backend proxy:

```javascript
// Example Express.js proxy
app.post('/api/ai-analyze', async (req, res) => {
  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }
  );
  const data = await response.json();
  res.json(data);
});
```

Then update the AI service to call your proxy instead of the API directly.

## 🤝 Manual Alternatives

Don't want to use AI? You can still:

1. **Manual Markers**: Click "Add Manual" and place markers by clicking on images
2. **JSON Import**: Create your own JSON file with discrepancies
3. **Automated Scripts**: Write your own image comparison scripts

## 📝 Example Workflow

```bash
# 1. Export Figma frame as PNG
# 2. Take production screenshot

# 3. Run AI analysis
python ai-analysis-script.py \
  --figma figma-design.png \
  --production prod-screenshot.png \
  --output results.json

# 4. Open the web tool
# 5. Upload both images
# 6. Import results.json
# 7. Review and adjust markers
# 8. Export final report
```

## 🔐 Security Notes

- API keys are only used locally (never sent to our servers)
- Images are sent directly to OpenAI/Anthropic
- No data is stored or logged by the tool
- Use environment variables for API keys (don't hardcode them)

## 📚 Additional Resources

- [OpenAI Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Anthropic Claude Vision Docs](https://docs.anthropic.com/claude/docs/vision)
- [CORS Explanation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
