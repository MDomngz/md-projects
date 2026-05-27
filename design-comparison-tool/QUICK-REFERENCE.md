# Quick Reference Card

## 🚀 Installation (One-Time Setup)

### Linux/macOS
```bash
chmod +x install.sh && ./install.sh
```

### Windows
```cmd
install.bat
```

---

## 🔑 API Key Setup (One-Time)

### Get Key
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/settings/keys

### Set Key
```bash
# Linux/macOS
export OPENAI_API_KEY="sk-proj-..."
export ANTHROPIC_API_KEY="sk-ant-..."

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-proj-..."
$env:ANTHROPIC_API_KEY="sk-ant-..."

# Windows (CMD)
set OPENAI_API_KEY=sk-proj-...
set ANTHROPIC_API_KEY=sk-ant-...
```

---

## ⚡ Quick Usage

### Easiest Method
```bash
# Linux/macOS
./analyze.sh figma.png production.png

# Windows
analyze.bat figma.png production.png
```

### Python
```bash
python ai-analysis-script.py --figma figma.png --production prod.png
```

### Node.js
```bash
node ai-analysis-script.js --figma figma.png --production prod.png
```

### Use Claude Instead
```bash
./analyze.sh figma.png production.png anthropic
```

---

## 📥 Import to Web Tool

1. Run analysis → Get `discrepancies-XXXXXX.json`
2. Open web tool in browser
3. Upload both images
4. Click **"Import JSON"**
5. Select the JSON file
6. Done! ✅

---

## 📝 Command Options

```bash
--figma <path>         # Figma design image (required)
--production <path>    # Production screenshot (required)
--output <path>        # Output file (default: discrepancies.json)
--provider <name>      # openai or anthropic (default: openai)
--api-key <key>        # API key (or use env var)
```

---

## 🔍 Common Issues

| Problem | Solution |
|---------|----------|
| "Command not found" | Install Python/Node.js |
| "Module not found" | Run `pip install -r requirements.txt` |
| "No API key" | Set environment variable |
| "Invalid API key" | Check key and billing |
| "Permission denied" | Run `chmod +x *.sh` |

---

## 💰 Costs

- **~$0.01-0.05** per comparison
- **Higher resolution = higher cost**
- **Monitor usage in API dashboard**

---

## 📊 Output Format

```json
{
  "discrepancies": [
    {
      "type": "color",
      "severity": "high",
      "description": "...",
      "location": {"x": 120, "y": 85},
      "area": {"width": 100, "height": 40},
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    }
  ]
}
```

---

## 🎯 Types & Severity

**Types**: color, spacing, typography, size, border, alignment, missing, formatting

**Severity**: high, medium, low

---

## 📚 Full Documentation

- **Setup**: `SETUP.md`
- **AI Details**: `AI-ANALYSIS-README.md`
- **Package Info**: `README-LOCAL-SETUP.md`

---

## ⚡ Super Quick Start

```bash
# 1. Install
./install.sh

# 2. Get API key from https://platform.openai.com/api-keys

# 3. Set key
export OPENAI_API_KEY="sk-proj-..."

# 4. Run
./analyze.sh figma.png production.png

# 5. Import the generated JSON to web tool
```

**Done!** 🎉
