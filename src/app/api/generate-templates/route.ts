import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { logoImage, companyName } = await request.json();

    if (!logoImage) {
      return NextResponse.json(
        { error: 'Logo image is required' },
        { status: 400 }
      );
    }

    console.log('🎨 Generating 3 card templates with AI...');

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
                media_type: logoImage.split(';')[0].split(':')[1],
                data: logoImage.split(',')[1],
              },
            },
            {
              type: 'text',
              text: `
              You are a professional credit card designer.

              Generate EXACTLY 3 DIFFERENT credit card designs based on the attached logo${companyName ? ' for ' + companyName : ''}.

              Return ONLY valid JSON.
              Do NOT include markdown.
              Do NOT include explanations.
              Do NOT include code fences.
              Do NOT include any text before or after the JSON.

              Return this exact JSON shape (top-level object with a "templates" array):

              {
                "templates": [
                  {
                    "name": "Design name",
                    "frontBg": "linear-gradient(...)",
                    "backBg": "linear-gradient(...)",
                    "frontElements": [
                      {
                        "id": "el-1",
                        "type": "image",
                        "face": "front",
                        "x": 24,
                        "y": 20,
                        "width": 72,
                        "height": 72,
                        "content": "",
                        "color": "#ffffff",
                        "fontSize": 16,
                        "backgroundColor": "transparent",
                        "opacity": 1,
                        "rotation": 0,
                        "iconName": "",
                        "imageData": ""
                      }
                    ],
                    "backElements": []
                  }
                ]
              }

              ALLOWED VALUES:
              - type must be one of: "text", "cardNumber", "circle", "rectangle", "icon", "image"
              - face must be "front" or "back"
              - iconName (only for type="icon") must be one of:
                "Sparkles","Heart","Star","Zap","Shield","Lock","Globe","Wifi","Battery","Sun","Moon","Cloud"
              - imageData MUST be an empty string (we inject the logo server-side)

              REQUIREMENTS (must follow):
              - templates MUST contain EXACTLY 3 objects
              - Each template MUST use AT LEAST 3 DIFFERENT types across its elements
              - Each template MUST include:
                (1) one element with type="image" for the logo,
                (2) one element with type="cardNumber",
                (3) at least one accent element with type in ("icon","circle","rectangle")
              - Vary layouts between templates (logo position top-left / top-right / center, etc.)
              - x must be a NUMBER between 0 and 428
              - y must be a NUMBER between 0 and 270
              - width/height must be NUMBERS
              - Do NOT include placeholder text like "number (0-428)"
              - Return valid JSON only
              `,
            },
          ],
        },
      ],
    });

    // Join all text blocks Claude may return
    const responseText = message.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('\n')
      .trim();

    console.log('📄 AI RAW RESPONSE:', responseText);
    console.log(
      '📦 AI content block types:',
      (message as any)?.content?.map((c: any) => c?.type)
    );

    // Clean common AI formatting issues
    const cleaned = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .trim();

    // Extract either a JSON object `{...}` OR a JSON array `[...]`
    const firstObj = cleaned.indexOf('{');
    const firstArr = cleaned.indexOf('[');

    const startsWithObj =
      firstObj !== -1 && (firstArr === -1 || firstObj < firstArr);
    const startsWithArr =
      firstArr !== -1 && (firstObj === -1 || firstArr < firstObj);

    let jsonString = '';

    if (startsWithObj) {
      const lastObj = cleaned.lastIndexOf('}');
      if (lastObj === -1 || lastObj <= firstObj) {
        throw new Error('No JSON object found in AI response');
      }
      jsonString = cleaned.slice(firstObj, lastObj + 1);
    } else if (startsWithArr) {
      const lastArr = cleaned.lastIndexOf(']');
      if (lastArr === -1 || lastArr <= firstArr) {
        throw new Error('No JSON array found in AI response');
      }
      jsonString = cleaned.slice(firstArr, lastArr + 1);
    } else {
      console.error('❌ AI response had no JSON markers. Raw:', cleaned);
      throw new Error('No JSON found in AI response');
    }

    // Remove trailing commas before } or ]
    jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');

    let data: any;
    try {
      const parsed = JSON.parse(jsonString);

      // If the model returned an array directly, treat it as templates
      data = Array.isArray(parsed) ? { templates: parsed } : parsed;
    } catch (err) {
      console.error('❌ JSON PARSE FAILED. Extracted JSON was:', jsonString);
      throw new Error('AI returned malformed JSON.');
    }

    if (!data.templates || !Array.isArray(data.templates)) {
      throw new Error('AI response missing templates array.');
    }

    // Inject logo image server-side + normalize elements + ensure at least 3 component types
    const uid = () =>
      `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const clamp = (n: number, lo: number, hi: number) =>
      Math.max(lo, Math.min(hi, n));

    const normalizeEl = (el: any, face: 'front' | 'back') => {
      const type = el?.type;
      const isTexty = type === 'text' || type === 'cardNumber';
      const isShape = type === 'circle' || type === 'rectangle';

      return {
        id: typeof el?.id === 'string' ? el.id : uid(),
        type,
        face: el?.face === 'front' || el?.face === 'back' ? el.face : face,
        x: clamp(Number(el?.x ?? 0), 0, 428),
        y: clamp(Number(el?.y ?? 0), 0, 270),
        width: clamp(Number(el?.width ?? (type === 'icon' ? 40 : 120)), 20, 428),
        height: clamp(Number(el?.height ?? (type === 'icon' ? 40 : 40)), 20, 270),
        content:
          typeof el?.content === 'string'
            ? el.content
            : isTexty
              ? (type === 'cardNumber' ? '4532 8720 1456 7890' : 'BLAZEUP')
              : '',
        color: typeof el?.color === 'string' ? el.color : '#ffffff',
        fontSize: clamp(Number(el?.fontSize ?? (type === 'cardNumber' ? 20 : 16)), 6, 48),
        backgroundColor:
          typeof el?.backgroundColor === 'string'
            ? el.backgroundColor
            : (isShape ? 'rgba(255,255,255,0.12)' : 'transparent'),
        opacity: clamp(Number(el?.opacity ?? 1), 0, 1),
        rotation: clamp(Number(el?.rotation ?? 0), 0, 360),
        iconName: typeof el?.iconName === 'string' ? el.iconName : undefined,
        imageData: type === 'image' ? logoImage : '',
      };
    };

    const ensureMinComponents = (front: any[], back: any[]) => {
      const all = [...front, ...back];
      const types = new Set(all.map((e) => e?.type).filter(Boolean));

      const hasLogo = all.some((e) => e?.type === 'image');
      const hasCardNumber = all.some((e) => e?.type === 'cardNumber');
      const hasAccent = all.some(
        (e) =>
          e?.type === 'icon' || e?.type === 'circle' || e?.type === 'rectangle'
      );

      const nextFront = [...front];

      if (!hasLogo) {
        nextFront.push(
          normalizeEl(
            {
              type: 'image',
              x: 24,
              y: 20,
              width: 72,
              height: 72,
              opacity: 0.95,
              rotation: 0,
            },
            'front'
          )
        );
        types.add('image');
      }

      if (!hasCardNumber) {
        nextFront.push(
          normalizeEl(
            {
              type: 'cardNumber',
              x: 24,
              y: 160,
              width: 320,
              height: 30,
              content: '4532 8720 1456 7890',
              fontSize: 20,
              opacity: 0.95,
            },
            'front'
          )
        );
        types.add('cardNumber');
      }

      if (!hasAccent) {
        nextFront.push(
          normalizeEl(
            {
              type: 'icon',
              x: 360,
              y: 28,
              width: 34,
              height: 34,
              iconName: 'Wifi',
              opacity: 0.55,
              rotation: 0,
            },
            'front'
          )
        );
        types.add('icon');
      }

      // If still less than 3 component types, add a subtle shape accent
      if (types.size < 3) {
        nextFront.push(
          normalizeEl(
            {
              type: 'circle',
              x: 300,
              y: 90,
              width: 90,
              height: 90,
              backgroundColor: 'rgba(255,255,255,0.10)',
              opacity: 0.35,
              rotation: 0,
            },
            'front'
          )
        );
      }

      return { front: nextFront, back };
    };

    const templatesWithLogo = data.templates.map((template: any) => {
      const frontRaw = Array.isArray(template.frontElements)
        ? template.frontElements
        : [];
      const backRaw = Array.isArray(template.backElements)
        ? template.backElements
        : [];

      const frontNorm = frontRaw
        .filter((e: any) => e && e.type)
        .map((e: any) => normalizeEl(e, 'front'));
      const backNorm = backRaw
        .filter((e: any) => e && e.type)
        .map((e: any) => normalizeEl(e, 'back'));

      const ensured = ensureMinComponents(frontNorm, backNorm);

      return {
        name: typeof template.name === 'string' ? template.name : 'AI Design',
        frontBg:
          typeof template.frontBg === 'string'
            ? template.frontBg
            : 'linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 50%,#0d0d2b 100%)',
        backBg:
          typeof template.backBg === 'string'
            ? template.backBg
            : 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
        frontElements: ensured.front,
        backElements: ensured.back,
      };
    });

    return NextResponse.json({ templates: templatesWithLogo });

  } catch (error: any) {
    console.error('❌ Error generating templates:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate templates' },
      { status: 500 }
    );
  }
}