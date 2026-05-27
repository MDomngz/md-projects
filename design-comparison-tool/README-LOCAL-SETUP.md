# Local Setup Package Files

This directory contains everything needed to run AI-powered design comparison analysis locally.

## 📦 Package Contents

### Core Scripts
- **`ai-analysis-script.py`** - Python implementation of AI vision analysis
- **`ai-analysis-script.js`** - Node.js implementation of AI vision analysis

### Package Files
- **`requirements.txt`** - Python dependencies (pip)
- **`ai-scripts-package.json`** - Node.js dependencies (npm)

### Installation Scripts
- **`install.sh`** - Automated installation for Linux/macOS
- **`install.bat`** - Automated installation for Windows

### Execution Scripts
- **`analyze.sh`** - Quick analysis script for Linux/macOS
- **`analyze.bat`** - Quick analysis script for Windows

### Documentation
- **`SETUP.md`** - Complete setup and usage guide
- **`AI-ANALYSIS-README.md`** - Detailed AI analysis documentation
- **`README-LOCAL-SETUP.md`** - This file

---

## 🚀 Quick Start

### Automatic Installation

**Linux/macOS:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
install.bat
```

The installer will:
1. Detect Python and/or Node.js
2. Ask which you prefer to use
3. Install all required dependencies
4. Make scripts executable

### Manual Installation

**Python Setup:**
```bash
pip install -r requirements.txt
```

**Node.js Setup:**
```bash
npm install openai @anthropic-ai/sdk
```

---

## 🔑 API Key Setup

### Get Your API Key

Choose one provider:

- **OpenAI GPT-4 Vision**: https://platform.openai.com/api-keys
- **Anthropic Claude 3.5**: https://console.anthropic.com/settings/keys

### Set Environment Variable

**Linux/macOS:**
```bash
# OpenAI
export OPENAI_API_KEY="sk-proj-your-key-here"

# OR Anthropic
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Add to ~/.bashrc or ~/.zshrc to persist
echo 'export OPENAI_API_KEY="sk-proj-your-key-here"' >> ~/.bashrc
```

**Windows (PowerShell):**
```powershell
# OpenAI
$env:OPENAI_API_KEY="sk-proj-your-key-here"

# OR Anthropic
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"

# To persist, add to PowerShell profile
```

**Windows (Command Prompt):**
```cmd
REM OpenAI
set OPENAI_API_KEY=sk-proj-your-key-here

REM OR Anthropic
set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## 🎯 Usage

### Using Quick Scripts

**Linux/macOS:**
```bash
# Make executable first
chmod +x analyze.sh

# Run analysis
./analyze.sh figma-design.png production-screenshot.png
./analyze.sh figma-design.png production-screenshot.png anthropic
```

**Windows:**
```cmd
analyze.bat figma-design.png production-screenshot.png
analyze.bat figma-design.png production-screenshot.png anthropic
```

### Using Python Script Directly

```bash
# With OpenAI
python ai-analysis-script.py \
  --figma design.png \
  --production screenshot.png \
  --output results.json

# With Anthropic
python ai-analysis-script.py \
  --figma design.png \
  --production screenshot.png \
  --provider anthropic \
  --output results.json
```

### Using Node.js Script Directly

```bash
# With OpenAI
node ai-analysis-script.js \
  --figma design.png \
  --production screenshot.png \
  --output results.json

# With Anthropic
node ai-analysis-script.js \
  --figma design.png \
  --production screenshot.png \
  --provider anthropic \
  --output results.json
```

---

## 📥 Import to Web Tool

1. Run the analysis script (generates JSON file)
2. Open Design Comparison Tool in browser
3. Upload both images (Figma design + production screenshot)
4. Click **"Import JSON"** in the sidebar
5. Select the generated JSON file
6. View all AI-detected discrepancies!

---

## 📋 File Descriptions

### `requirements.txt`
Python package dependencies:
- `openai` - OpenAI GPT-4 Vision API client
- `anthropic` - Anthropic Claude Vision API client
- `Pillow` - Image processing library

### `ai-scripts-package.json`
Node.js package configuration with:
- `openai` - OpenAI API client
- `@anthropic-ai/sdk` - Anthropic API client

### `install.sh` / `install.bat`
Automated installers that:
- Detect Python/Node.js availability
- Prompt for preference
- Install all dependencies
- Verify installation

### `analyze.sh` / `analyze.bat`
Convenience wrappers that:
- Validate input files
- Check API keys
- Run appropriate script
- Display results
- Generate timestamped output files

---

## 🔧 Troubleshooting

### "Command not found: python"
```bash
# Try python3 instead
python3 ai-analysis-script.py ...

# Or install Python 3.8+
```

### "ModuleNotFoundError"
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### "Cannot find module 'openai'"
```bash
# Reinstall Node.js dependencies
npm install openai @anthropic-ai/sdk
```

### "Invalid API key"
- Verify your API key is correct
- Check it's not expired
- Ensure you have credits/billing setup

### "Permission denied" (Linux/macOS)
```bash
# Make scripts executable
chmod +x install.sh analyze.sh
```

---

## 💰 Cost Estimation

Typical costs per image comparison:

| Provider | Model | Cost per Comparison |
|----------|-------|---------------------|
| OpenAI | GPT-4o | ~$0.01 - $0.05 |
| Anthropic | Claude 3.5 Sonnet | ~$0.01 - $0.04 |

Factors affecting cost:
- Image size (larger = more expensive)
- Image resolution (higher = more expensive)
- Number of tokens in response

---

## 🎯 Example Workflow

```bash
# 1. Install dependencies
./install.sh

# 2. Set API key
export OPENAI_API_KEY="sk-proj-..."

# 3. Run analysis
./analyze.sh figma.png production.png

# Output:
# =======================================
#    AI Vision Analysis
# =======================================
# 
# Figma Image:      figma.png
# Production Image: production.png
# Provider:         openai
# 
# Starting analysis...
# 
# ✓ Analysis complete!
#   Found 12 discrepancies
#   Saved to: discrepancies-20240423-143022.json

# 4. Import JSON to web tool
# 5. Review and adjust markers
# 6. Export final report
```

---

## 📊 Output Format

Generated JSON structure:

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
    }
  ]
}
```

Discrepancy types:
- `color` - Color differences
- `spacing` - Spacing/padding/margin issues
- `typography` - Font differences
- `size` - Dimension differences
- `border` - Border style/width differences
- `alignment` - Positioning issues
- `missing` - Missing elements
- `formatting` - Other formatting issues

Severity levels:
- `high` - Critical issues needing immediate attention
- `medium` - Important issues to address
- `low` - Minor inconsistencies

---

## 🔐 Security Best Practices

1. **Never commit API keys to version control**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo "*.json" >> .gitignore
   ```

2. **Use environment variables**
   ```bash
   # Instead of hardcoding
   export OPENAI_API_KEY="..."
   ```

3. **Rotate keys periodically**
   - Generate new keys every 90 days
   - Revoke old keys immediately

4. **Monitor usage**
   - Check API usage dashboards regularly
   - Set up billing alerts

---

## 📚 Additional Resources

- **Setup Guide**: `SETUP.md`
- **AI Analysis Details**: `AI-ANALYSIS-README.md`
- **OpenAI Docs**: https://platform.openai.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **Python Tutorial**: https://www.python.org/about/gettingstarted/
- **Node.js Guide**: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

---

## 🆘 Getting Help

If you encounter issues:

1. Check `SETUP.md` troubleshooting section
2. Verify API keys are set correctly
3. Ensure images are valid PNG/JPEG files
4. Check console output for error messages
5. Review API provider status pages

---

## ✅ Verification Checklist

Before running analysis:

- [ ] Python 3.8+ or Node.js 18+ installed
- [ ] Dependencies installed (`pip install` or `npm install`)
- [ ] API key obtained from provider
- [ ] API key set as environment variable
- [ ] Images prepared (same size, PNG/JPEG format)
- [ ] Scripts are executable (Linux/macOS: `chmod +x`)

---

## 🎉 You're Ready!

Everything is set up. Start analyzing your designs:

```bash
./analyze.sh your-figma-design.png your-production-screenshot.png
```

Happy analyzing! 🚀
