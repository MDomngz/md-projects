#!/usr/bin/env python3
"""
AI Vision Analysis Script for Design Comparison Tool

This script performs AI-powered visual comparison between Figma designs
and production screenshots, generating a JSON file that can be imported
into the Design Comparison Tool.

Usage:
    python ai-analysis-script.py --figma design.png --production prod.png --output discrepancies.json

Requirements:
    pip install openai pillow
    OR
    pip install anthropic pillow

Set your API key as an environment variable:
    export OPENAI_API_KEY="your-key-here"
    OR
    export ANTHROPIC_API_KEY="your-key-here"
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path


def encode_image_to_base64(image_path: str) -> str:
    """Encode image file to base64 string."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def get_image_mime_type(image_path: str) -> str:
    """Get MIME type from image file extension."""
    ext = Path(image_path).suffix.lower()
    mime_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }
    return mime_types.get(ext, "image/png")


def analyze_with_openai(figma_path: str, production_path: str, api_key: str) -> dict:
    """Analyze images using OpenAI GPT-4 Vision."""
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: OpenAI package not installed. Run: pip install openai")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    figma_b64 = encode_image_to_base64(figma_path)
    prod_b64 = encode_image_to_base64(production_path)
    figma_mime = get_image_mime_type(figma_path)
    prod_mime = get_image_mime_type(production_path)

    prompt = """You are a precise design comparison expert. Compare these two images:
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

If the images are identical or nearly identical, return {"discrepancies": []}.
"""

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{figma_mime};base64,{figma_b64}",
                            "detail": "high",
                        },
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{prod_mime};base64,{prod_b64}",
                            "detail": "high",
                        },
                    },
                ],
            }
        ],
        max_tokens=4000,
        temperature=0.1,
    )

    content = response.choices[0].message.content
    # Remove markdown code blocks if present
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    return json.loads(content)


def analyze_with_anthropic(figma_path: str, production_path: str, api_key: str) -> dict:
    """Analyze images using Anthropic Claude Vision."""
    try:
        from anthropic import Anthropic
    except ImportError:
        print("Error: Anthropic package not installed. Run: pip install anthropic")
        sys.exit(1)

    client = Anthropic(api_key=api_key)

    figma_b64 = encode_image_to_base64(figma_path)
    prod_b64 = encode_image_to_base64(production_path)
    figma_mime = get_image_mime_type(figma_path)
    prod_mime = get_image_mime_type(production_path)

    prompt = """You are a precise design comparison expert. Compare these two images:
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

If the images are identical or nearly identical, return {"discrepancies": []}.
"""

    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4000,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": figma_mime,
                            "data": figma_b64,
                        },
                    },
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": prod_mime,
                            "data": prod_b64,
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    )

    content = message.content[0].text
    # Remove markdown code blocks if present
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    return json.loads(content)


def main():
    parser = argparse.ArgumentParser(
        description="Analyze design discrepancies using AI vision models"
    )
    parser.add_argument(
        "--figma", required=True, help="Path to Figma design image"
    )
    parser.add_argument(
        "--production", required=True, help="Path to production screenshot"
    )
    parser.add_argument(
        "--output",
        default="discrepancies.json",
        help="Output JSON file path (default: discrepancies.json)",
    )
    parser.add_argument(
        "--provider",
        choices=["openai", "anthropic"],
        default="openai",
        help="AI provider to use (default: openai)",
    )
    parser.add_argument(
        "--api-key",
        help="API key (or set OPENAI_API_KEY/ANTHROPIC_API_KEY env var)",
    )

    args = parser.parse_args()

    # Validate input files
    if not Path(args.figma).exists():
        print(f"Error: Figma image not found: {args.figma}")
        sys.exit(1)
    if not Path(args.production).exists():
        print(f"Error: Production image not found: {args.production}")
        sys.exit(1)

    # Get API key
    api_key = args.api_key
    if not api_key:
        if args.provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
        else:
            api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        print(
            f"Error: API key not provided. Set {args.provider.upper()}_API_KEY "
            "environment variable or use --api-key"
        )
        sys.exit(1)

    print(f"Analyzing images with {args.provider.upper()}...")
    print(f"  Figma: {args.figma}")
    print(f"  Production: {args.production}")

    try:
        if args.provider == "openai":
            result = analyze_with_openai(args.figma, args.production, api_key)
        else:
            result = analyze_with_anthropic(args.figma, args.production, api_key)

        # Write results
        with open(args.output, "w") as f:
            json.dump(result, f, indent=2)

        num_discrepancies = len(result.get("discrepancies", []))
        print(f"\n✓ Analysis complete!")
        print(f"  Found {num_discrepancies} discrepancies")
        print(f"  Saved to: {args.output}")
        print(f"\nImport this file into the Design Comparison Tool using 'Import JSON'")

    except Exception as e:
        print(f"\n✗ Error during analysis: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
