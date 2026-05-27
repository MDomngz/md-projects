import type { Discrepancy } from '../components/design-comparison';

interface AIVisionResponse {
  discrepancies: Omit<Discrepancy, 'id'>[];
  error?: string;
}

export async function analyzeImagesWithAI(
  figmaImageBase64: string,
  productionImageBase64: string,
  apiKey: string,
  provider: 'openai' | 'anthropic'
): Promise<AIVisionResponse> {
  try {
    if (provider === 'openai') {
      return await analyzeWithOpenAI(figmaImageBase64, productionImageBase64, apiKey);
    } else {
      return await analyzeWithAnthropic(figmaImageBase64, productionImageBase64, apiKey);
    }
  } catch (error) {
    console.error('AI Vision Analysis Error:', error);
    
    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        discrepancies: [],
        error: 'CORS Error: Direct API calls are blocked by browsers. Please use a CORS proxy or backend server. See console for details.'
      };
    }
    
    return {
      discrepancies: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function analyzeWithOpenAI(
  figmaImageBase64: string,
  productionImageBase64: string,
  apiKey: string
): Promise<AIVisionResponse> {
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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: figmaImageBase64,
                detail: 'high'
              }
            },
            {
              type: 'image_url',
              image_url: {
                url: productionImageBase64,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenAI API');
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonContent = content.trim();
  if (jsonContent.startsWith('```json')) {
    jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.replace(/```\n?/g, '');
  }

  const parsed = JSON.parse(jsonContent);
  return { discrepancies: parsed.discrepancies || [] };
}

async function analyzeWithAnthropic(
  figmaImageBase64: string,
  productionImageBase64: string,
  apiKey: string
): Promise<AIVisionResponse> {
  // Convert base64 to the format Anthropic expects
  const getFigmaMediaType = (base64: string) => {
    if (base64.startsWith('data:image/png')) return 'image/png';
    if (base64.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (base64.startsWith('data:image/jpg')) return 'image/jpeg';
    if (base64.startsWith('data:image/webp')) return 'image/webp';
    if (base64.startsWith('data:image/gif')) return 'image/gif';
    return 'image/png'; // default
  };

  const extractBase64Data = (dataUrl: string) => {
    return dataUrl.split(',')[1] || dataUrl;
  };

  const figmaMediaType = getFigmaMediaType(figmaImageBase64);
  const prodMediaType = getFigmaMediaType(productionImageBase64);

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
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
                media_type: figmaMediaType,
                data: extractBase64Data(figmaImageBase64)
              }
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: prodMediaType,
                data: extractBase64Data(productionImageBase64)
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('No response from Anthropic API');
  }

  // Parse JSON from response (handle markdown code blocks)
  let jsonContent = content.trim();
  if (jsonContent.startsWith('```json')) {
    jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.replace(/```\n?/g, '');
  }

  const parsed = JSON.parse(jsonContent);
  return { discrepancies: parsed.discrepancies || [] };
}