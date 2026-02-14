import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getClientIP,
  hashIP,
  hasIPGeneratedThisMonth,
  hasReachedGlobalLimit,
  recordGeneration,
} from '@/lib/rate-limit';

interface GenerateCardRequest {
  logoImage: string;
  companyName?: string;
}

async function generateCardDesign(logoBase64: string, companyName?: string): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Extract just the base64 data without the data URL prefix
  const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, '');

  // Detect the image type
  let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/png';
  if (logoBase64.startsWith('data:image/jpeg') || logoBase64.startsWith('data:image/jpg')) {
    mediaType = 'image/jpeg';
  } else if (logoBase64.startsWith('data:image/gif')) {
    mediaType = 'image/gif';
  } else if (logoBase64.startsWith('data:image/webp')) {
    mediaType = 'image/webp';
  }

  const prompt = `You are a professional credit card designer. Generate a beautiful, modern credit card design as JSON.

${companyName ? `Company Name: ${companyName}` : ''}

Return ONLY a JSON object with this exact structure:
{
  "elements": [
    {
      "id": 1708012345678,
      "type": "image",
      "x": 20,
      "y": 20,
      "width": 80,
      "height": 80,
      "content": "",
      "color": "#ffffff",
      "fontSize": 16,
      "backgroundColor": "transparent",
      "opacity": 1,
      "imageData": "USE_PROVIDED_LOGO"
    },
    {
      "id": 1708012345679,
      "type": "cardNumber",
      "x": 30,
      "y": 150,
      "width": 200,
      "height": 30,
      "content": "•••• •••• •••• 1234",
      "color": "#ffffff",
      "fontSize": 20,
      "backgroundColor": "transparent",
      "opacity": 1
    },
    {
      "id": 1708012345680,
      "type": "text",
      "x": 30,
      "y": 190,
      "width": 150,
      "height": 25,
      "content": "CARDHOLDER NAME",
      "color": "#ffffff",
      "fontSize": 14,
      "backgroundColor": "transparent",
      "opacity": 1
    },
    {
      "id": 1708012345681,
      "type": "text",
      "x": 300,
      "y": 190,
      "width": 60,
      "height": 25,
      "content": "MM/YY",
      "color": "#ffffff",
      "fontSize": 14,
      "backgroundColor": "transparent",
      "opacity": 1
    }
  ],
  "cardColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}

Create a professional, visually striking design. Use elegant gradients. Include decorative elements if appropriate. Each element needs a unique timestamp-based id.`;

  console.log('Image type detected:', mediaType);
  console.log('Base64 data length:', base64Data.length);

  const message = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Data,
            },
          },
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ||
                    responseText.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    throw new Error('Failed to extract valid JSON from AI response');
  }

  return jsonMatch[1];
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get client IP
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    console.log('Generation request from IP:', clientIP.substring(0, 10) + '...');

    // 2. Check global limit first
    const globalLimit = await hasReachedGlobalLimit();
    console.log('Global count:', globalLimit.count);

    if (globalLimit.reached) {
      return NextResponse.json(
        {
          error: `We've reached our monthly limit of 1,000 free designs! Try again next month.`,
          globalCount: globalLimit.count,
        },
        { status: 429 }
      );
    }

    // 3. Check if this IP already generated this month
    const alreadyGenerated = await hasIPGeneratedThisMonth(ipHash);
    console.log('IP already generated:', alreadyGenerated);

    if (alreadyGenerated) {
      return NextResponse.json(
        {
          error: 'You have already used your free generation this month. Come back next month!',
          globalCount: globalLimit.count,
        },
        { status: 429 }
      );
    }

    // 4. Parse request body
    const body: GenerateCardRequest = await request.json();
    const { logoImage, companyName } = body;

    if (!logoImage || !logoImage.startsWith('data:image')) {
      return NextResponse.json(
        { error: 'Invalid logo image format' },
        { status: 400 }
      );
    }

    // 5. Check image size (max 5MB)
    const imageSizeBytes = (logoImage.length * 3) / 4;
    if (imageSizeBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    console.log('Generating design with Claude...');

    // 6. Generate card design with Claude
    const designJson = await generateCardDesign(logoImage, companyName);
    const design = JSON.parse(designJson);

    // Replace placeholder with actual logo
    if (design.elements) {
      design.elements = design.elements.map((el: any) => {
        if (el.imageData === 'USE_PROVIDED_LOGO') {
          return { ...el, imageData: logoImage };
        }
        return el;
      });
    }

    console.log('Design generated successfully!');

    // 7. Record the generation
    await recordGeneration(ipHash);
    console.log('Generation recorded in database');

    // 8. Get updated count
    const updatedLimit = await hasReachedGlobalLimit();

    return NextResponse.json({
      success: true,
      design: {
        elements: design.elements || [],
        cardColor: design.cardColor || '#1a1a2e',
      },
      remaining: 1000 - updatedLimit.count,
      message: updatedLimit.count >= 950
        ? `Only ${1000 - updatedLimit.count} free designs left this month!`
        : undefined,
    });

  } catch (error: any) {
    console.error('Card generation error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.status);

    // Log the full error object
    if (error.error) {
      console.error('API Error details:', JSON.stringify(error.error, null, 2));
    }

    if (error.message?.includes('rate_limit')) {
      return NextResponse.json(
        { error: 'AI service rate limit reached. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate card design. Please try again.',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    const [alreadyGenerated, globalLimit] = await Promise.all([
      hasIPGeneratedThisMonth(ipHash),
      hasReachedGlobalLimit(),
    ]);

    return NextResponse.json({
      canGenerate: !alreadyGenerated && !globalLimit.reached,
      hasGeneratedThisMonth: alreadyGenerated,
      globalCount: globalLimit.count,
      globalLimit: 1000,
      remaining: 1000 - globalLimit.count,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
