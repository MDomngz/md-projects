#!/bin/bash
#
# Installation Script for AI Analysis Tools
# Automatically detects and installs dependencies
#

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  Design Comparison AI Tools Setup${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""

# Function to check command existence
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect available package managers
PYTHON_AVAILABLE=false
NODE_AVAILABLE=false

if command_exists python3; then
    PYTHON_AVAILABLE=true
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo -e "${GREEN}✓${NC} Python detected: $PYTHON_VERSION"
elif command_exists python; then
    PYTHON_AVAILABLE=true
    PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
    echo -e "${GREEN}✓${NC} Python detected: $PYTHON_VERSION"
fi

if command_exists node; then
    NODE_AVAILABLE=true
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js detected: $NODE_VERSION"
fi

echo ""

# If neither is available, exit
if [ "$PYTHON_AVAILABLE" = false ] && [ "$NODE_AVAILABLE" = false ]; then
    echo -e "${RED}Error: Neither Python nor Node.js found${NC}"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3.8+: https://www.python.org/downloads/"
    echo "  - Node.js 18+: https://nodejs.org/"
    exit 1
fi

# Ask user preference if both are available
INSTALL_CHOICE=""
if [ "$PYTHON_AVAILABLE" = true ] && [ "$NODE_AVAILABLE" = true ]; then
    echo "Both Python and Node.js are available."
    echo ""
    echo "Which would you like to use for AI analysis?"
    echo "  1) Python (recommended)"
    echo "  2) Node.js"
    echo "  3) Both"
    echo ""
    read -p "Enter choice (1-3): " choice
    
    case $choice in
        1) INSTALL_CHOICE="python" ;;
        2) INSTALL_CHOICE="node" ;;
        3) INSTALL_CHOICE="both" ;;
        *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
    esac
elif [ "$PYTHON_AVAILABLE" = true ]; then
    INSTALL_CHOICE="python"
else
    INSTALL_CHOICE="node"
fi

echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
echo ""

# Install Python dependencies
if [ "$INSTALL_CHOICE" = "python" ] || [ "$INSTALL_CHOICE" = "both" ]; then
    echo -e "${GREEN}Installing Python packages...${NC}"
    
    if command_exists pip3; then
        pip3 install -r requirements.txt
    elif command_exists pip; then
        pip install -r requirements.txt
    else
        echo -e "${RED}Error: pip not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Python dependencies installed"
    echo ""
fi

# Install Node.js dependencies
if [ "$INSTALL_CHOICE" = "node" ] || [ "$INSTALL_CHOICE" = "both" ]; then
    echo -e "${GREEN}Installing Node.js packages...${NC}"
    
    if command_exists npm; then
        npm install openai @anthropic-ai/sdk
        npm install --prefix ai-scripts
    elif command_exists yarn; then
        yarn add openai @anthropic-ai/sdk
        yarn --cwd ai-scripts install
    else
        echo -e "${RED}Error: npm or yarn not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓${NC} Node.js dependencies installed"
    echo ""
fi

# Make scripts executable
chmod +x analyze.sh 2>/dev/null || true
chmod +x ai-analysis-script.py 2>/dev/null || true

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Installation Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Get an API key:"
echo "   • OpenAI: https://platform.openai.com/api-keys"
echo "   • Anthropic: https://console.anthropic.com/settings/keys"
echo ""
echo "2. Set your API key:"
echo "   export OPENAI_API_KEY='sk-proj-your-key-here'"
echo "   # OR"
echo "   export ANTHROPIC_API_KEY='sk-ant-your-key-here'"
echo ""
echo "3. Run analysis:"
if [ "$INSTALL_CHOICE" = "python" ]; then
    echo "   python ai-analysis-script.py --figma design.png --production prod.png"
elif [ "$INSTALL_CHOICE" = "node" ]; then
    echo "   node ai-analysis-script.js --figma design.png --production prod.png"
else
    echo "   ./analyze.sh design.png prod.png"
fi
echo ""
echo "For more details, see SETUP.md"
echo ""
