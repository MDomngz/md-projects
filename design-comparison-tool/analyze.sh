#!/bin/bash
#
# Quick AI Analysis Script
# Usage: ./analyze.sh <figma-image> <production-image> [provider]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 <figma-image> <production-image> [provider]"
    echo ""
    echo "Examples:"
    echo "  $0 figma.png production.png"
    echo "  $0 figma.png production.png openai"
    echo "  $0 figma.png production.png anthropic"
    exit 1
fi

FIGMA_IMAGE="$1"
PRODUCTION_IMAGE="$2"
PROVIDER="${3:-openai}"  # Default to openai
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_FILE="discrepancies-${TIMESTAMP}.json"

# Validate images exist
if [ ! -f "$FIGMA_IMAGE" ]; then
    echo -e "${RED}Error: Figma image not found: $FIGMA_IMAGE${NC}"
    exit 1
fi

if [ ! -f "$PRODUCTION_IMAGE" ]; then
    echo -e "${RED}Error: Production image not found: $PRODUCTION_IMAGE${NC}"
    exit 1
fi

# Check for API key
if [ "$PROVIDER" = "openai" ]; then
    if [ -z "$OPENAI_API_KEY" ]; then
        echo -e "${RED}Error: OPENAI_API_KEY environment variable not set${NC}"
        echo "Set it with: export OPENAI_API_KEY='sk-proj-your-key-here'"
        echo "Get your key from: https://platform.openai.com/api-keys"
        exit 1
    fi
elif [ "$PROVIDER" = "anthropic" ]; then
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}Error: ANTHROPIC_API_KEY environment variable not set${NC}"
        echo "Set it with: export ANTHROPIC_API_KEY='sk-ant-your-key-here'"
        echo "Get your key from: https://console.anthropic.com/settings/keys"
        exit 1
    fi
else
    echo -e "${RED}Error: Invalid provider '$PROVIDER'. Use 'openai' or 'anthropic'${NC}"
    exit 1
fi

# Check if Python or Node.js script exists
if [ -f "ai-analysis-script.py" ]; then
    SCRIPT_TYPE="python"
    SCRIPT_CMD="python ai-analysis-script.py"
elif [ -f "ai-analysis-script.js" ]; then
    SCRIPT_TYPE="node"
    SCRIPT_CMD="node ai-analysis-script.js"
else
    echo -e "${RED}Error: No analysis script found${NC}"
    echo "Make sure ai-analysis-script.py or ai-analysis-script.js exists in this directory"
    exit 1
fi

# Print configuration
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}   AI Vision Analysis${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "Figma Image:      ${YELLOW}$FIGMA_IMAGE${NC}"
echo -e "Production Image: ${YELLOW}$PRODUCTION_IMAGE${NC}"
echo -e "Provider:         ${YELLOW}${PROVIDER}${NC}"
echo -e "Script:           ${YELLOW}${SCRIPT_TYPE}${NC}"
echo -e "Output:           ${YELLOW}${OUTPUT_FILE}${NC}"
echo ""
echo -e "${GREEN}Starting analysis...${NC}"
echo ""

# Run the analysis
$SCRIPT_CMD \
    --figma "$FIGMA_IMAGE" \
    --production "$PRODUCTION_IMAGE" \
    --provider "$PROVIDER" \
    --output "$OUTPUT_FILE"

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ Analysis Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════${NC}"
    echo ""
    echo -e "Results saved to: ${YELLOW}${OUTPUT_FILE}${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Open the Design Comparison Tool in your browser"
    echo "2. Upload both images"
    echo "3. Click 'Import JSON' and select: $OUTPUT_FILE"
    echo ""
else
    echo -e "${RED}✗ Analysis failed${NC}"
    exit 1
fi
