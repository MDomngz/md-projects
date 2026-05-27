# Design Comparison Tool — Foundation Document

**Project:** Design Comparison Tool/
**Date:** May 2026/
**Owner:** Marisa Dominguez/
**Status:** in development
---

## Overview

The Design Comparison Tool is a local web app for comparing Figma design mockups against production screenshots to identify visual discrepancies. It has two parts that work together:

1. **React Web App** — an interactive canvas where you load images, place markers, and manage a list of discrepancies
2. **AI Analysis Scripts** — Node.js/Python scripts that use AI vision (Claude or GPT-4) to automatically detect discrepancies and export them as JSON for import into the web app

The tool is built to run fully locally. No data is sent to external servers beyond the AI API call itself.

---

## Goals

- Give designers and engineers a structured way to QA production implementations against Figma specs
- Automate discrepancy detection using AI vision, reducing manual comparison time
- Provide a consistent taxonomy for categorizing and prioritizing visual issues
- Keep the workflow local — no cloud infrastructure, no auth, no accounts

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | React + TypeScript (Vite) | Component-based UI, fast dev iteration |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, consistent component library |
| UI Components | Radix UI primitives | Accessible, unstyled base components |
| AI Analysis (Python) | `openai`, `anthropic`, `Pillow` | Multi-provider support, image processing |
| AI Analysis (Node.js) | `openai`, `@anthropic-ai/sdk` | Same functionality in JS |
| Build | Vite 6 | Fast builds, native ESM |
| Package Manager | pnpm | Workspace support, faster installs |

---

## Repository Structure

```
design-comparison-tool/
├── index.html                        # App entry point
├── vite.config.ts                    # Vite configuration
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript config
├── src/
│   ├── main.tsx                      # React root
│   ├── styles/
│   │   └── index.css                 # Global styles
│   └── app/
│       ├── App.tsx                   # Root component
│       ├── components/
│       │   ├── design-comparison.tsx # Main app shell + state
│       │   ├── comparison-canvas.tsx # Side-by-side image canvas
│       │   ├── comparison-mode.tsx   # Toggle between view modes
│       │   ├── discrepancy-list.tsx  # Sidebar list of issues
│       │   ├── discrepancy-form.tsx  # Add/edit a discrepancy
│       │   ├── discrepancy-manager.tsx # Import/export JSON
│       │   ├── discrepancy-filter.tsx  # Filter by type/severity
│       │   ├── discrepancy-zone.tsx  # Clickable canvas region
│       │   ├── marker.tsx            # Placed discrepancy pin
│       │   ├── marker-tooltip.tsx    # Hover detail on marker
│       │   ├── analysis-insights.tsx # AI analysis summary panel
│       │   ├── ai-analysis-config.tsx # AI provider settings
│       │   ├── figma-url-input.tsx   # Figma URL fetch input
│       │   ├── figma-api-notice.tsx  # CORS/API warning banner
│       │   ├── image-selector.tsx    # Upload or URL image loader
│       │   ├── spacing-details.tsx   # Spacing measurement detail
│       │   ├── reference-guide.tsx   # Inline help/legend
│       │   ├── clickable-image.tsx   # Zoom/pan image wrapper
│       │   └── ui/                   # shadcn/ui components
│       └── services/
│           └── local-discrepancy-detector.ts  # Client-side CV detection
├── ai-scripts/                       # AI analysis scripts
│   └── ai-analysis-script.cjs        # Node.js analysis runner
├── ai-analysis-script.py             # Python analysis runner
├── ai-analysis-script.js             # Node.js analysis runner (root copy)
├── requirements.txt                  # Python dependencies
├── ai-scripts-package.json           # Node.js script dependencies
├── install.sh / install.bat          # Automated installers
├── analyze.sh / analyze.bat          # Quick analysis runners
└── dist/                             # Built output (after pnpm build)
```

---

## Discrepancy Data Model

Every identified discrepancy follows this shape:

```ts
interface Discrepancy {
  id: string;
  type: 'color' | 'spacing' | 'typography' | 'size' | 'border' | 'alignment'
      | 'padding' | 'margin' | 'line-height' | 'space-after' | 'formatting'
      | 'missing' | 'content';
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: { x: number; y: number };          // canvas coordinates
  figmaValue?: string;                          // expected value from design
  productionValue?: string;                     // actual value in prod
  source?: 'auto' | 'import' | 'manual';       // how it was created
  reportingBucket?: ReportingBucket;            // high-level category
  ignored?: boolean;
}
```

### Reporting Buckets

High-level categories used for grouping issues in reports:

| Bucket | Description |
|---|---|
| `missing_text_elements` | Missing words, labels, or inline content |
| `large_spacing_discrepancies` | Structure, rhythm, or alignment shifts |
| `color_issues` | Color-channel differences or tone mismatches |
| `major_visual_issues` | Large block differences; missing or altered components |

---

## Core Workflows

### Workflow A — Manual Comparison

1. Open the app (`pnpm dev` or serve `dist/`)
2. Upload a Figma design screenshot (via file upload, image URL, or Figma URL)
3. Upload a production screenshot
4. Click on the canvas to place discrepancy markers
5. Fill in type, severity, and description for each marker
6. Filter and review the discrepancy list
7. Export to JSON for reporting

### Workflow B — AI-Assisted Comparison

1. Run the AI analysis script with two images as input:
   ```bash
   cd ai-scripts
   node ai-analysis-script.cjs \
     --figma path/to/figma.png \
     --production path/to/production.png \
     --provider anthropic \
     --output discrepancies.json
   ```
2. Open the app and upload the same images
3. Open Discrepancy Manager → Import JSON
4. Review, edit, and supplement AI-placed markers manually
5. Export a final JSON report

### Workflow C — CV-Refined Analysis

Same as B, with `--cv-refine true` to enable client-side computer vision coordinate refinement for more precise marker placement (slower, more accurate):

```bash
node ai-analysis-script.cjs \
  --figma figma.png \
  --production prod.png \
  --provider anthropic \
  --cv-refine true \
  --output discrepancies.json
```

---

## AI Analysis Scripts

Two equivalent implementations are provided (use whichever runtime is available):

### Python (`ai-analysis-script.py`)
- Providers: OpenAI GPT-4 Vision, Anthropic Claude 3.5 Sonnet
- Dependencies: `openai`, `anthropic`, `Pillow`
- Install: `pip install -r requirements.txt`

### Node.js (`ai-scripts/ai-analysis-script.cjs`)
- Providers: OpenAI GPT-4 Vision, Anthropic Claude 3.5 Sonnet
- Dependencies: `openai`, `@anthropic-ai/sdk`
- Install: `npm install --prefix ai-scripts`

### Environment Variables

```bash
export OPENAI_API_KEY="sk-proj-..."       # OpenAI
export ANTHROPIC_API_KEY="sk-ant-..."     # Anthropic (Claude)
```

API keys are read from environment variables only. Never passed on the command line or stored in files.

### Estimated Cost per Analysis

| Provider | Model | Approx. Cost |
|---|---|---|
| OpenAI | GPT-4 Vision | ~$0.01–0.05 |
| Anthropic | Claude 3.5 Sonnet | ~$0.01–0.04 |

---

## Local Development

**Requirements:** Node.js 18+, pnpm

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Type check
pnpm type-check
```

**Note:** The project requires pnpm (not npm) due to pnpm workspaces configuration.

---

## Known Constraints

- **No Figma API direct access from browser** — Figma URLs cannot be fetched directly from the browser due to CORS. The app displays a notice and falls back to manual file upload when a Figma URL is entered. A local proxy or the AI scripts are needed for automated image extraction.
- **AI analysis is not real-time** — Analysis scripts must be run separately and the output imported into the app. There is no in-browser AI call.
- **No persistence** — Discrepancy data is not saved between sessions unless exported as JSON. There is no backend or local storage.
- **No diff overlay rendering** — The tool shows images side-by-side and pins markers; it does not render a pixel-diff overlay.

---

## File Naming Conventions

- Components: `kebab-case.tsx`
- Services: `kebab-case.ts`
- Scripts: `ai-analysis-script.{cjs,py,js}`
- Generated output: `discrepancies.json` (convention, not enforced)
