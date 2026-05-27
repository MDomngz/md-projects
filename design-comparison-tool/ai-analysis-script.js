#!/usr/bin/env node
/**
 * AI Vision Analysis Script for Design Comparison Tool
 * 
 * This script performs AI-powered visual comparison between Figma designs
 * and production screenshots, generating a JSON file that can be imported
 * into the Design Comparison Tool.
 * 
 * Usage:
 *   node ai-analysis-script.js --figma design.png --production prod.png --output discrepancies.json
 * 
 * Requirements:
 *   npm install openai
 *   OR
 *   npm install @anthropic-ai/sdk
 * 
 * Set your API key as an environment variable:
 *   export OPENAI_API_KEY="your-key-here"
 *   OR
 *   export ANTHROPIC_API_KEY="your-key-here"
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      parsed[key] = args[i + 1];
      i++;
    }
  }
  
  return parsed;
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

  const prompt = `You are a precise design comparison expert. Compare these two images:
1. Figma Design (first image)
2. Production Implementation (second image)

Analyze and identify ALL visual discrepancies between them. For each discrepancy found, provide:
- type: one of [color, spacing, typography, size, border, alignment, padding, margin, line-height, missing, formatting]
- severity: one of [high, medium, low]
- description: clear explanation of the issue
- location: {x, y} coordinates in pixels where the issue appears (estimate based on image)
- area: {width, height} size of the affected area in pixels
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
      "area": {"width": 100, "height": 40},
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    }
  ]
}

If the images are identical or nearly identical, return {"discrepancies": []}.`;

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

  const prompt = `You are a precise design comparison expert. Compare these two images:
1. Figma Design (first image)
2. Production Implementation (second image)

Analyze and identify ALL visual discrepancies between them. For each discrepancy found, provide:
- type: one of [color, spacing, typography, size, border, alignment, padding, margin, line-height, missing, formatting]
- severity: one of [high, medium, low]
- description: clear explanation of the issue
- location: {x, y} coordinates in pixels where the issue appears (estimate based on image)
- area: {width, height} size of the affected area in pixels
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
      "area": {"width": 100, "height": 40},
      "figmaValue": "#005EA2",
      "productionValue": "#0064B4"
    }
  ]
}

If the images are identical or nearly identical, return {"discrepancies": []}.`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
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

  let content = message.content[0].text.trim();
  
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

// Main function
async function main() {
  const args = parseArgs();

  if (!args.figma || !args.production) {
    console.error('Usage: node ai-analysis-script.js --figma <path> --production <path> [--output <path>] [--provider openai|anthropic] [--api-key <key>]');
    process.exit(1);
  }

  const figmaPath = args.figma;
  const productionPath = args.production;
  const outputPath = args.output || 'discrepancies.json';
  const provider = args.provider || 'openai';
  let apiKey = args['api-key'];

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
    if (provider === 'openai') {
      apiKey = process.env.OPENAI_API_KEY;
    } else {
      apiKey = process.env.ANTHROPIC_API_KEY;
    }
  }

  if (!apiKey) {
    console.error(`Error: API key not provided. Set ${provider.toUpperCase()}_API_KEY environment variable or use --api-key`);
    process.exit(1);
  }

  console.log(`Analyzing images with ${provider.toUpperCase()}...`);
  console.log(`  Figma: ${figmaPath}`);
  console.log(`  Production: ${productionPath}`);

  try {
    let result;
    if (provider === 'openai') {
      result = await analyzeWithOpenAI(figmaPath, productionPath, apiKey);
    } else {
      result = await analyzeWithAnthropic(figmaPath, productionPath, apiKey);
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
