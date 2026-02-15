import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getClientIP,
  hashIP,
  hasIPGeneratedThisMonth,
  hasReachedGlobalLimit,
  recordGeneration,
} from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Get client IP
    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    console.log('Template generation request from IP:', clientIP.substring(0, 10) + '...');

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
    const { logoImage } = await request.json();

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
          content: `Return ONLY this JSON with 3 card design templates. No explanations.

{"templates":[
{"name":"Ocean Depths","frontBg":"linear-gradient(135deg,#0a192f 0%,#0d3b66 50%,#114b5f 100%)","backBg":"linear-gradient(135deg,#0a192f 0%,#0d3b66 50%,#114b5f 100%)","frontElements":[{"id":"logo1","type":"image","face":"front","x":280,"y":25,"width":70,"height":70,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"transparent","opacity":1,"rotation":0,"fontFamily":"'Inter',sans-serif","fontWeight":400,"letterSpacing":0,"imageData":""},{"id":"icon1","type":"icon","face":"front","x":370,"y":25,"width":32,"height":32,"content":"","color":"#14b8a6","fontSize":16,"backgroundColor":"transparent","opacity":0.8,"rotation":0,"iconName":"Wifi"},{"id":"circle1","type":"circle","face":"front","x":260,"y":150,"width":80,"height":80,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"#115e59","opacity":0.3,"rotation":0}],"backElements":[]},
{"name":"Sunset Glow","frontBg":"linear-gradient(135deg,#2d1b4e 0%,#5c2d82 40%,#8b3a62 70%,#c9485b 100%)","backBg":"linear-gradient(135deg,#2d1b4e 0%,#5c2d82 40%,#8b3a62 70%,#c9485b 100%)","frontElements":[{"id":"logo2","type":"image","face":"front","x":320,"y":30,"width":75,"height":75,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"transparent","opacity":1,"rotation":0,"fontFamily":"'Inter',sans-serif","fontWeight":400,"letterSpacing":0,"imageData":""},{"id":"circle2","type":"circle","face":"front","x":170,"y":80,"width":90,"height":90,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"#a855f7","opacity":0.25,"rotation":0},{"id":"icon2","type":"icon","face":"front","x":260,"y":30,"width":36,"height":36,"content":"","color":"#e9d5ff","fontSize":16,"backgroundColor":"transparent","opacity":0.9,"rotation":0,"iconName":"Heart"}],"backElements":[]},
{"name":"Royal Night","frontBg":"linear-gradient(135deg,#141e30 0%,#243b55 100%)","backBg":"linear-gradient(135deg,#141e30 0%,#243b55 100%)","frontElements":[{"id":"logo3","type":"image","face":"front","x":280,"y":100,"width":70,"height":70,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"transparent","opacity":1,"rotation":0,"fontFamily":"'Inter',sans-serif","fontWeight":400,"letterSpacing":0,"imageData":""},{"id":"rect3","type":"rectangle","face":"front","x":350,"y":120,"width":55,"height":100,"content":"","color":"#ffffff","fontSize":16,"backgroundColor":"#6366f1","opacity":0.2,"rotation":0},{"id":"icon3","type":"icon","face":"front","x":365,"y":30,"width":32,"height":32,"content":"","color":"#bfdbfe","fontSize":16,"backgroundColor":"transparent","opacity":0.85,"rotation":0,"iconName":"Shield"}],"backElements":[]}
]}

ONLY use these EXACT gradients for frontBg/backBg:
- linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 50%,#0d0d2b 100%)
- linear-gradient(135deg,#141e30 0%,#243b55 100%)
- linear-gradient(135deg,#1a0a0a 0%,#4a1515 50%,#2d0808 100%)
- linear-gradient(145deg,#0a1628 0%,#1a3a5c 40%,#0d4f4f 70%,#0a2818 100%)
- linear-gradient(135deg,#2c2c3a 0%,#3d3d52 50%,#1e1e2e 100%)
- linear-gradient(135deg,#2d1b4e 0%,#5c2d82 40%,#8b3a62 70%,#c9485b 100%)
- linear-gradient(135deg,#0a192f 0%,#0d3b66 50%,#114b5f 100%)
- linear-gradient(135deg,#1a1a0a 0%,#4a3f15 50%,#8b7320 100%)

ONLY use these EXACT preset colors for icon color and shape backgroundColor:
#ffffff,#f8fafc,#e2e8f0,#94a3b8,#64748b,#334155,#1e293b,#0f172a,#000000,#ef4444,#f97316,#eab308,#22c55e,#14b8a6,#3b82f6,#6366f1,#a855f7,#ec4899,#fecaca,#fed7aa,#fef08a,#bbf7d0,#99f6e4,#bfdbfe,#c7d2fe,#e9d5ff,#fbcfe8,#991b1b,#9a3412,#854d0e,#166534,#115e59,#1e40af,#3730a3,#6b21a8,#9d174d

Place elements in safe zones only: logo/icons x:240-400 y:20-100, circles/rectangles x:160-380 y:70-180. Avoid hardware: bank name (x:15-215 y:15-41), chip (x:47-102 y:92-135), cardholder (x:24-244 y:224-246).

Each template: 1 "image", 1-3 decorative (icon/circle/rectangle). Icons: Wifi/Shield/Star/Heart/Lock/Globe/Zap/Sparkles. Return JSON:`,
        },
      ],
    });

    // Join all text blocks Claude may return
    const responseText = message.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('\n')
      .trim();

    console.log('📄 AI RAW RESPONSE (first 500 chars):', responseText.substring(0, 500));
    console.log('📏 AI RESPONSE LENGTH:', responseText.length);
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

    console.log('🔍 First { at index:', firstObj);
    console.log('🔍 First [ at index:', firstArr);
    console.log('🔍 Cleaned response (first 300 chars):', cleaned.substring(0, 300));

    const startsWithObj =
      firstObj !== -1 && (firstArr === -1 || firstObj < firstArr);
    const startsWithArr =
      firstArr !== -1 && (firstObj === -1 || firstArr < firstObj);

    let jsonString = '';

    if (startsWithObj) {
      const lastObj = cleaned.lastIndexOf('}');
      if (lastObj === -1 || lastObj <= firstObj) {
        console.error('❌ Last } at index:', lastObj);
        throw new Error('No JSON object found in AI response');
      }
      jsonString = cleaned.slice(firstObj, lastObj + 1);
      console.log('✅ Extracted JSON object, length:', jsonString.length);
    } else if (startsWithArr) {
      const lastArr = cleaned.lastIndexOf(']');
      if (lastArr === -1 || lastArr <= firstArr) {
        console.error('❌ Last ] at index:', lastArr);
        throw new Error('No JSON array found in AI response');
      }
      jsonString = cleaned.slice(firstArr, lastArr + 1);
      console.log('✅ Extracted JSON array, length:', jsonString.length);
    } else {
      console.error('❌ AI response had no JSON markers.');
      console.error('Cleaned response:', cleaned);
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

    // Inject logo image server-side and normalize elements
    const uid = () => `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

    const normalizeEl = (el: any, face: 'front' | 'back') => {
      const type = el?.type;
      const isTexty = type === 'text' || type === 'cardNumber';
      const isShape = type === 'circle' || type === 'rectangle';

      // Normalize color to lowercase hex (convert rgba to default if needed)
      const normalizeColor = (color: string | undefined, defaultColor: string): string => {
        if (!color) return defaultColor;
        if (color === 'transparent') return 'transparent';
        // If it's rgba() or rgb(), return default color (we only want hex)
        if (color.toLowerCase().startsWith('rgba') || color.toLowerCase().startsWith('rgb')) {
          return defaultColor;
        }
        // Convert hex to lowercase
        return color.toLowerCase().startsWith('#') ? color.toLowerCase() : defaultColor;
      };

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
              ? (type === 'cardNumber' ? '4532 8720 1456 7890' : 'CARDHOLDER NAME')
              : '',
        color: normalizeColor(el?.color, '#ffffff'),
        fontSize: clamp(Number(el?.fontSize ?? (type === 'cardNumber' ? 20 : 16)), 6, 48),
        backgroundColor: normalizeColor(el?.backgroundColor, isShape ? 'rgba(255,255,255,0.12)' : 'transparent'),
        opacity: clamp(Number(el?.opacity ?? 1), 0, 1),
        rotation: clamp(Number(el?.rotation ?? 0), 0, 360),
        fontFamily: typeof el?.fontFamily === 'string' ? el.fontFamily : "'Inter',sans-serif",
        fontWeight: [300, 400, 500, 600, 700].includes(Number(el?.fontWeight)) ? Number(el.fontWeight) : 400,
        letterSpacing: typeof el?.letterSpacing === 'number' ? clamp(el.letterSpacing, 0, 10) : 0,
        iconName: typeof el?.iconName === 'string' ? el.iconName : undefined,
        imageData: type === 'image' ? logoImage : '',
      };
    };

    const ensureMinComponents = (front: any[], back: any[]) => {
      const all = [...front, ...back];

      const hasLogo = all.some((e) => e?.type === 'image');
      const hasDecorative = all.some(
        (e) => e?.type === 'icon' || e?.type === 'circle' || e?.type === 'rectangle'
      );

      const nextFront = [...front];
      const nextBack = [...back];

      // Only ensure logo and at least one decorative element
      // Card number, cardholder name, etc. are provided by default template
      if (!hasLogo) {
        nextFront.push(normalizeEl({ type: 'image', x: 24, y: 20, width: 80, height: 80, opacity: 1, rotation: 0 }, 'front'));
      }

      if (!hasDecorative) {
        nextFront.push(
          normalizeEl(
            { type: 'icon', x: 370, y: 24, width: 36, height: 36, iconName: 'Wifi', color: '#e0e0e0', opacity: 0.7, rotation: 0 },
            'front'
          )
        );
      }

      return { front: nextFront, back: nextBack };
    };

    const templatesWithLogo = data.templates.map((template: any) => {
      const frontRaw = Array.isArray(template.frontElements) ? template.frontElements : [];
      const backRaw = Array.isArray(template.backElements) ? template.backElements : [];

      const frontNorm = frontRaw.filter((e: any) => e && e.type).map((e: any) => normalizeEl(e, 'front'));
      const backNorm = backRaw.filter((e: any) => e && e.type).map((e: any) => normalizeEl(e, 'back'));

      const ensured = ensureMinComponents(frontNorm, backNorm);

      return {
        name: typeof template.name === 'string' ? template.name : 'AI Design',
        frontBg: typeof template.frontBg === 'string'
          ? template.frontBg
          : 'linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 50%,#0d0d2b 100%)',
        backBg: typeof template.backBg === 'string'
          ? template.backBg
          : 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',
        frontElements: ensured.front,
        backElements: ensured.back,
      };
    });

    console.log('Templates generated successfully!');

    // Record the generation
    await recordGeneration(ipHash);
    console.log('Generation recorded in database');

    // Get updated count
    const updatedLimit = await hasReachedGlobalLimit();

    return NextResponse.json({
      templates: templatesWithLogo,
      remaining: 1000 - updatedLimit.count,
      message: updatedLimit.count >= 950
        ? `Only ${1000 - updatedLimit.count} free designs left this month!`
        : undefined,
    });

  } catch (error: any) {
    console.error('❌ Error generating templates:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate templates' },
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