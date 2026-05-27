# Design Comparison Tool

> **Visual diff tool for Figma designs vs. production implementations**

Two parts: a **React web app** for interactive comparison, and **AI analysis scripts** that generate discrepancy reports for import into the web app.

---

## Web App Setup

**Requirements:** Node.js 18+, pnpm

```bash
# Install (pnpm required — project uses pnpm workspaces)
pnpm install

# Start dev server
pnpm dev
```

App runs at `http://localhost:5173`. Load Figma and production screenshots, place markers manually or import AI-generated JSON.

**Build for production:**
```bash
pnpm build       # outputs to dist/
```

**Type check:**
```bash
pnpm type-check
```

---

## AI Analysis Scripts — Quick Start (3 Steps)

```bash
# 1. Install
./install.sh          # Linux/macOS
install.bat           # Windows

# 2. Set API Key
export OPENAI_API_KEY="sk-proj-your-key-here"

# 3. Analyze
./analyze.sh figma-design.png production-screenshot.png
```

**Then import the generated JSON file into the web tool!**

---

## 📦 What's Included

This package provides **complete local AI analysis** to bypass browser CORS restrictions:

✅ **Two core analysis scripts** (Python + Node.js)  
✅ **Automated installers** for all platforms  
✅ **Quick execution scripts** for easy usage  
✅ **Comprehensive documentation** with examples  
✅ **API key management** with security best practices  

---

## 🎯 Features

- 🤖 **AI-Powered Analysis** - GPT-4 Vision or Claude 3.5 Sonnet
- 🎨 **Detects Multiple Issue Types** - Color, spacing, typography, borders, alignment, etc.
- 📊 **Severity Classification** - High, medium, low priority levels
- 📍 **Precise Locations** - X/Y coordinates for each discrepancy
- 🔍 **Detailed Comparisons** - Figma value vs. production value
- 💾 **JSON Export** - Import directly into web tool
- 🔐 **Secure** - API keys stay local, never sent to our servers

---

## 📚 Documentation

| Document | Description | Start Here? |
|----------|-------------|-------------|
| **QUICK-REFERENCE.md** | One-page cheat sheet | ⭐ **YES!** |
| **SETUP.md** | Complete setup guide | If you need help |
| **AI-ANALYSIS-README.md** | AI details & CORS info | For understanding |
| **README-LOCAL-SETUP.md** | Package overview | For reference |
| **INDEX.md** | Complete file index | For navigation |

---

## 🔧 Installation

### Option 1: Automatic (Recommended)

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
- ✅ Detect Python and/or Node.js
- ✅ Ask for your preference
- ✅ Install all dependencies
- ✅ Verify installation

### Option 2: Manual

**Python:**
```bash
pip install -r requirements.txt
```

**Node.js:**
```bash
npm install openai @anthropic-ai/sdk
```

---

## 🔑 API Keys

### Get Your Key

Choose one provider:

- **OpenAI GPT-4 Vision**: https://platform.openai.com/api-keys (~$0.01-0.05 per analysis)
- **Anthropic Claude 3.5**: https://console.anthropic.com/settings/keys (~$0.01-0.04 per analysis)

### Set Your Key

**Linux/macOS:**
```bash
export OPENAI_API_KEY="sk-proj-your-key-here"
# OR
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-proj-your-key-here"
# OR
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**Windows (Command Prompt):**
```cmd
set OPENAI_API_KEY=sk-proj-your-key-here
REM OR
set ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## 💻 Usage

### Easy Mode (Recommended)

**Linux/macOS:**
```bash
./analyze.sh figma.png production.png
./analyze.sh figma.png production.png anthropic  # Use Claude
```

**Windows:**
```cmd
analyze.bat figma.png production.png
analyze.bat figma.png production.png anthropic
```

### Python

```bash
python ai-analysis-script.py \
  --figma design.png \
  --production screenshot.png \
  --output results.json
```

### Node.js

```bash
node ai-analysis-script.js \
  --figma design.png \
  --production screenshot.png \
  --output results.json
```

---

## 📥 Import to Web Tool

1. **Run analysis** (generates `discrepancies-XXXXXX.json`)
2. **Open web tool** in your browser
3. **Upload both images** (Figma + production)
4. **Click "Import JSON"** in the sidebar
5. **Select the JSON file**
6. **View results!** All markers appear with details

---

## 📊 Output Format

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

**Supported Types:**
- `color` - Color differences
- `spacing` - Padding, margins, gaps
- `typography` - Fonts, sizes, weights
- `size` - Element dimensions
- `border` - Border styles and widths
- `alignment` - Positioning issues
- `missing` - Missing elements
- `formatting` - Other formatting differences

**Severity Levels:**
- `high` - Critical issues
- `medium` - Important issues
- `low` - Minor issues

---

## 🔍 How It Works

```
┌──────────────┐
│ Figma Design │
│   (PNG/JPG)  │
└──────┬───────┘
       │
       ├─────────┐
       │         │
       │    ┌────▼────────┐
       │    │ Production  │
       │    │  Screenshot │
       │    │  (PNG/JPG)  │
       │    └────┬────────┘
       │         │
       ▼         ▼
┌──────────────────────┐
│   AI Vision API      │
│  (GPT-4 or Claude)   │
│                      │
│  Analyzes both       │
│  images and finds    │
│  visual differences  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Structured JSON     │
│                      │
│  - Type              │
│  - Severity          │
│  - Location          │
│  - Description       │
│  - Expected/Actual   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Import to Web Tool  │
│  Visual markers +    │
│  organized findings  │
└──────────────────────┘
```

---

## 🎯 Best Practices

### Image Preparation
- ✅ Use same dimensions for both images
- ✅ High resolution (1920px+ width recommended)
- ✅ PNG format for best quality
- ✅ Clear, well-lit screenshots

### API Key Security
- ✅ Use environment variables
- ✅ Never commit keys to git
- ✅ Rotate keys periodically
- ✅ Monitor usage in provider dashboards

### Cost Management
- ✅ Batch similar comparisons
- ✅ Compress large images if needed
- ✅ Set up billing alerts
- ✅ Use appropriate image detail level

### Result Accuracy
- ✅ Review AI results manually
- ✅ AI may miss subtle differences
- ✅ Verify critical discrepancies
- ✅ Supplement with manual markers

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Command not found: python` | Install Python 3.8+ or use `python3` |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `Cannot find module 'openai'` | Run `npm install openai` |
| `Invalid API key` | Check key, billing, and expiration |
| `Permission denied` | Run `chmod +x install.sh analyze.sh` |
| `CORS error` | Use local scripts (that's why we built this!) |

For detailed troubleshooting, see `SETUP.md`.

---

## 📁 File Structure

```
.
├── src/                       # React web app source
├── index.html                 # App entry point
├── vite.config.ts             # Vite config
├── tsconfig.json              # TypeScript config
├── package.json               # Web app dependencies (pnpm)
├── .env.example               # API key template — copy to .env
│
├── ai-analysis-script.py      # Python AI analysis script
├── ai-analysis-script.js      # Node.js AI analysis script (simple)
├── ai-scripts/                # Advanced Node.js script (Claude + CV refinement)
│   ├── ai-analysis-script.cjs
│   └── package.json
├── requirements.txt           # Python dependencies
├── install.sh                 # Auto-installer (Linux/macOS)
├── install.bat                # Auto-installer (Windows)
├── analyze.sh                 # Quick runner (Linux/macOS)
├── analyze.bat                # Quick runner (Windows)
│
├── README.md                  # This file
├── SETUP.md                   # Advanced ai-scripts/ setup guide
├── QUICK-REFERENCE.md         # Cheat sheet
├── AI-ANALYSIS-README.md      # AI analysis documentation
└── ATTRIBUTIONS.md            # Third-party attributions
```

---

## 💡 Example Workflow

```bash
# 1. One-time setup
./install.sh
export OPENAI_API_KEY="sk-proj-..."

# 2. Export your Figma frame as PNG
# (Use Figma: File → Export → PNG)

# 3. Take production screenshot
# (Browser screenshot at same resolution)

# 4. Run AI analysis
./analyze.sh figma-export.png prod-screenshot.png

# Output:
# ✓ Analysis complete!
#   Found 12 discrepancies
#   Saved to: discrepancies-20240423-143022.json

# 5. Open web tool and import JSON
# 6. Review markers, adjust if needed
# 7. Export final report for team

# 8. Run again for other components
./analyze.sh header-figma.png header-prod.png
./analyze.sh footer-figma.png footer-prod.png
```

---

## 🌟 Features of Generated JSON

When you import the JSON into the web tool, you get:

- 🎯 **Numbered markers** on canvas
- 🎨 **Color-coded severity** (red/yellow/blue)
- 📊 **Organized by category** (color, spacing, typography, etc.)
- 📋 **Filterable list** with search
- 💾 **Export capability** for reports
- 🔍 **Hover tooltips** with full details
- 📏 **Visual zones** showing affected areas
- 📈 **Analysis insights** with statistics

---

## 🔐 Privacy & Security

- ✅ **API keys stay local** - Never sent to our servers
- ✅ **Direct API calls** - Your browser → OpenAI/Anthropic
- ✅ **No data storage** - Nothing logged or saved
- ✅ **Open source scripts** - Review the code yourself
- ✅ **Environment variables** - Secure key management
- ✅ **Git-ignored** - Keys and results excluded from version control

---

## 💰 Pricing

| Provider | Model | Cost per Comparison | Notes |
|----------|-------|---------------------|-------|
| OpenAI | GPT-4o | $0.01 - $0.05 | Faster, good accuracy |
| Anthropic | Claude 3.5 Sonnet | $0.01 - $0.04 | Very detailed analysis |

**Factors affecting cost:**
- Image size (larger = more expensive)
- Image resolution (higher = more expensive)
- Response length (more discrepancies = higher cost)

**Cost optimization:**
- Compress images before analysis
- Use appropriate resolution
- Batch similar components

---

## 🎓 Learning Resources

- **Setup Guide**: `SETUP.md`
- **Quick Reference**: `QUICK-REFERENCE.md`
- **AI Details**: `AI-ANALYSIS-README.md`
- **OpenAI Docs**: https://platform.openai.com/docs/guides/vision
- **Anthropic Docs**: https://docs.anthropic.com/claude/docs/vision

---

## 🆘 Getting Help

1. Check `QUICK-REFERENCE.md` for commands
2. Read `SETUP.md` for troubleshooting
3. Review `AI-ANALYSIS-README.md` for AI details
4. Check provider status pages
5. Verify API keys and billing

---

## ✅ Quick Verification

After installation, verify everything works:

```bash
# 1. Check Python/Node.js
python --version  # or python3 --version
node --version

# 2. Check dependencies
pip list | grep openai
npm list openai

# 3. Check API key
echo $OPENAI_API_KEY  # Should show your key

# 4. Test run (with placeholder images)
./analyze.sh test-figma.png test-prod.png
```

---

## 🚀 You're Ready!

Everything is set up. Start analyzing:

```bash
./analyze.sh your-design.png your-screenshot.png
```

The output JSON can be imported directly into the Design Comparison web tool for visual review!

---

## 📝 License

This package is part of the Design Comparison Tool project.

**Author**: Design Comparison Tool Team  
**Version**: 1.0.0  
**Last Updated**: April 23, 2024  

---

## 🎉 Happy Analyzing!

Questions? Check the docs. Issues? See troubleshooting. Ready? Run the scripts!

```bash
./analyze.sh figma.png production.png
```

**Make your designs pixel-perfect!** ✨
