'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';

// ── Rich gradient palette ──
const COVER_GRADIENTS = [
  'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0d0d2b 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #4a1515 50%, #2d0808 100%)',
  'linear-gradient(145deg, #0a1628 0%, #1a3a5c 40%, #0d4f4f 70%, #0a2818 100%)',
  'linear-gradient(135deg, #2c2c3a 0%, #3d3d52 50%, #1e1e2e 100%)',
  'linear-gradient(135deg, #2d1b4e 0%, #5c2d82 40%, #8b3a62 70%, #c9485b 100%)',
  'linear-gradient(135deg, #0a192f 0%, #0d3b66 50%, #114b5f 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #4a3f15 50%, #8b7320 100%)',
  'linear-gradient(135deg, #0d1117 0%, #161b22 40%, #1f3a5f 100%)',
  'linear-gradient(135deg, #1a0025 0%, #3d0066 40%, #6600aa 100%)',
];

const COVER_PATTERNS = [
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><g fill='none' stroke='${c}' stroke-width='.8'><rect x='5' y='5' width='20' height='20' transform='rotate(45 15 15)'/><rect x='35' y='35' width='20' height='20' transform='rotate(45 45 45)'/><line x1='0' y1='30' x2='60' y2='30'/><line x1='30' y1='0' x2='30' y2='60'/></g></svg>`,
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='20'><g fill='none' stroke='${c}' stroke-width='1.2' stroke-linecap='round'><path d='M0,10 Q15,2 30,10 Q45,18 60,10 Q75,2 90,10 Q105,18 120,10'/></g></svg>`,
  (c: string) => { const s = 20, h = s * Math.sqrt(3), w = s * 3; return `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><g fill='none' stroke='${c}' stroke-width='.6'><polygon points='${s},0 ${s*2},0 ${s*2.5},${h/2} ${s*2},${h} ${s},${h} ${s*0.5},${h/2}'/></g></svg>`; },
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><g stroke='${c}' stroke-width='.5'><line x1='0' y1='0' x2='20' y2='20'/><line x1='20' y1='0' x2='0' y2='20'/></g></svg>`,
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><g fill='none' stroke='${c}' stroke-width='.6'><circle cx='20' cy='20' r='8'/><circle cx='0' cy='0' r='8'/><circle cx='40' cy='0' r='8'/><circle cx='0' cy='40' r='8'/><circle cx='40' cy='40' r='8'/></g></svg>`,
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='24'><g fill='none' stroke='${c}' stroke-width='1'><path d='M0,24 L20,12 L40,24'/><path d='M0,12 L20,0 L40,12'/></g></svg>`,
  (c: string) => `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><g fill='none' stroke='${c}' stroke-width='.6'><ellipse cx='50' cy='50' rx='45' ry='30'/><ellipse cx='50' cy='50' rx='30' ry='18'/><ellipse cx='50' cy='50' rx='15' ry='8'/></g></svg>`,
];

const NETWORK_LOGOS = ['VISA', 'MC', 'AMEX', 'RuPay'];
const CARD_NUMBERS = [
  '4532 •••• •••• 7891',
  '5412 •••• •••• 3456',
  '3782 •••• •••• 0012',
  '6521 •••• •••• 8834',
];
const NAMES = ['HARI SRINIVASAN', 'SRI HARI', 'VISHNU MUTHIAH', 'ARIA JOHNSON'];

// Crypto scramble characters
const CRYPTO_CHARS = '0123456789ABCDEF#$@!%&*?';

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}



export default React.memo(function FlippingCardCover({ isActive = true, onCycleComplete }: { isActive?: boolean; onCycleComplete?: () => void }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const cardFaceRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Display state
  const [displayNumber, setDisplayNumber] = useState(CARD_NUMBERS[0]);
  const [design, setDesign] = useState({
    name: NAMES[0],
    network: NETWORK_LOGOS[0],
  });

  const scrambleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Continuously scale the card to fit   direct DOM update, no React re-render
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    const VIRTUAL_W = 340;
    const VIRTUAL_H = 260;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) return;
        const s = Math.min(width / VIRTUAL_W, height / VIRTUAL_H, 1);
        inner.style.transform = `scale(${s})`;
      }
    });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  const generateRandomDesign = useCallback(() => ({
    name: randomItem(NAMES),
    network: randomItem(NETWORK_LOGOS),
  }), []);

  // ── Cryptographic number scramble animation ──
  const scrambleToNewNumber = useCallback(() => {
    const targetNumber = randomItem(CARD_NUMBERS);
    const targetChars = targetNumber.split('');
    let iteration = 0;
    const maxIterations = 8;

    // Clear any existing scramble
    if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);

    scrambleTimerRef.current = setInterval(() => {
      iteration++;
      const progress = iteration / maxIterations;

      // Build the scrambled string   characters resolve left to right
      const scrambled = targetChars.map((char, i) => {
        // Spaces and dots stay
        if (char === ' ' || char === '•') return char;
        // Characters resolve progressively from left to right
        const charProgress = (progress - (i / targetChars.length) * 0.5);
        if (charProgress > 0.5) return char; // resolved
        // Random crypto character
        return CRYPTO_CHARS[Math.floor(Math.random() * CRYPTO_CHARS.length)];
      }).join('');

      setDisplayNumber(scrambled);

      if (iteration >= maxIterations) {
        if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
        setDisplayNumber(targetNumber);
      }
    }, 40);
  }, []);

  // Smooth color cycling
  const cycleColors = useCallback(() => {
    const face = cardFaceRef.current;
    const pattern = patternRef.current;

    if (!face || !pattern) return;

    const nextGradient = randomItem(COVER_GRADIENTS);
    const nextPatIdx = Math.floor(Math.random() * COVER_PATTERNS.length);
    const nextPatColor = `rgba(255,255,255,${(Math.random() * 0.08 + 0.03).toFixed(2)})`;
    const svg = COVER_PATTERNS[nextPatIdx](nextPatColor);
    const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

    // Cross-fade pattern
    gsap.to(pattern, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        pattern.style.backgroundImage = patternUrl;
        gsap.to(pattern, { opacity: 0.6, duration: 0.5, ease: 'power2.inOut', overwrite: 'auto' });
      },
    });

    // Cross-fade gradient via overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute; inset: 0; border-radius: 14px;
      background: ${nextGradient}; opacity: 0; z-index: 0;
      pointer-events: none;
    `;
    face.appendChild(overlay);
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.8,
      ease: 'power1.inOut',
      overwrite: 'auto',
      onComplete: () => {
        face.style.background = nextGradient;
        overlay.remove();
      },
    });



    // Scramble card number + update text
    // scrambleToNewNumber();
    setDesign(generateRandomDesign());
  }, [generateRandomDesign, scrambleToNewNumber]);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    // Initial design
    cycleColors();

    // ── Card squish-swap: no rotation, no inverted text ──
    let repeatCount = 0;
    const tl = gsap.timeline({
      repeat: -1,
      paused: !isActive,
      onRepeat: () => {
        repeatCount++;
        if (repeatCount >= 1 && onCycleComplete) {
          repeatCount = 0;
          onCycleComplete();
        }
      },
    });
    tlRef.current = tl;

    // Hold showing current design
    tl.to({}, { duration: 1.5 });

    // Squish card horizontally to nothing
    tl.to(el, {
      scaleX: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Swap design while card is invisible
    tl.call(() => cycleColors());

    // Small pause for React to render new colors
    tl.to({}, { duration: 0.05 });

    // Expand card back with new design
    tl.to(el, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
      if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
    };
  }, [cycleColors]);

  // Pause/resume based on isActive
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (isActive) {
      tl.resume();
    } else {
      tl.pause();
    }
  }, [isActive]);



  const getPatternBg = (patIdx: number, color: string) => {
    const svg = COVER_PATTERNS[patIdx](color);
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  };

  // Card dimensions proportional to ISO 7810 (428×270 scaled down)
  // Scale factor: 280/428 ≈ 0.654
  const SCALE = 280 / 428;
  const chipX = 47.5 * SCALE;
  const chipY = 92.5 * SCALE;
  const chipW = 55 * SCALE;
  const chipH = 42.5 * SCALE;

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
     <div
      ref={innerRef}
      style={{
        perspective: 900,
        width: 340,
        height: 340,
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'scale(1)',
        transformOrigin: 'center center',
        transition: 'transform 0.15s ease-out',
      }}
    >

      <div
        ref={outerRef}
        style={{
          width: 320,
          height: 200,
          position: 'relative',
          transformStyle: 'preserve-3d',
          borderRadius: 14,
          willChange: 'transform',
          transform: 'rotateY(0deg)',
        }}
      >
        {/* Card face */}
        <div
          ref={cardFaceRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 14,
            overflow: 'hidden',
            background: COVER_GRADIENTS[0],
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
          }}
        >
          {/* Pattern overlay */}
          <div
            ref={patternRef}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: getPatternBg(0, 'rgba(255,255,255,0.06)'),
              backgroundRepeat: 'repeat',
              opacity: 0.6,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Card content   positioned to match credit-card-designer layout */}
          <div style={{
            position: 'relative', zIndex: 2, padding: 0, height: '100%',
          }}>
            {/* Bank name   top left, matching hw-bankname position */}
            <div style={{
              position: 'absolute',
              top: 10 * SCALE,
              left: 15 * SCALE,
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: 2.5,
              fontFamily: "'Inter', sans-serif",
            }}>
              DEMO BANK
            </div>

            {/* Network logo   top right */}
            <span style={{
              position: 'absolute',
              top: 10 * SCALE,
              right: 15 * SCALE,
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: 1.5,
              fontFamily: 'Arial, sans-serif',
              fontStyle: design.network === 'VISA' ? 'italic' : 'normal',
              transition: 'all 1s ease',
            }}>
              {design.network}
            </span>

            {/* EMV Chip   positioned exactly like the card designer */}
            <div style={{
              position: 'absolute',
              left: chipX,
              top: chipY,
            }}>
              <svg width={chipW} height={chipH} viewBox="0 0 56 44" fill="none">
                <rect x=".5" y=".5" width="55" height="43" rx="5" fill="url(#cg)" stroke="rgba(255,255,255,.15)" />
                <line x1="0" y1="16" x2="56" y2="16" stroke="rgba(255,255,255,.12)" strokeWidth=".8" />
                <line x1="0" y1="28" x2="56" y2="28" stroke="rgba(255,255,255,.12)" strokeWidth=".8" />
                <line x1="20" y1="0" x2="20" y2="44" stroke="rgba(255,255,255,.08)" strokeWidth=".8" />
                <line x1="36" y1="0" x2="36" y2="44" stroke="rgba(255,255,255,.08)" strokeWidth=".8" />
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="56" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c9a84c" />
                    <stop offset=".5" stopColor="#f0d56e" />
                    <stop offset="1" stopColor="#c9a84c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Contactless icon   right of chip */}
            <div style={{
              position: 'absolute',
              left: chipX + chipW + 8,
              top: chipY + (chipH - 18) / 2,
              opacity: 0.45,
              transform: 'rotate(90deg)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12.55a11 11 0 0114.08 0" />
                <path d="M1.42 9a16 16 0 0121.16 0" />
                <path d="M8.53 16.11a6 6 0 016.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>

            {/* Card number   with cryptographic scramble animation */}
            <div style={{
              position: 'absolute',
              bottom: 46,
              left: 15 * SCALE,
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: 2,
              fontFamily: "'Courier New', monospace",
              // Monospace ensures the scramble doesn't shift layout
            }}>
              {displayNumber}
            </div>

            {/* Cardholder name */}
            <div style={{
              position: 'absolute',
              bottom: 14,
              left: 15 * SCALE,
            }}>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 2 }}>
                CARD HOLDER
              </div>
              <div style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                letterSpacing: 2,
                fontFamily: "'Inter', sans-serif",
                transition: 'all 1s ease',
              }}>
                {design.name}
              </div>
            </div>

            {/* Valid thru */}
            <div style={{
              position: 'absolute',
              bottom: 14,
              right: 15 * SCALE,
              textAlign: 'right',
            }}>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, marginBottom: 2 }}>
                VALID THRU
              </div>
              <div style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.75)',
                fontFamily: "'Inter', sans-serif",
              }}>
                12/28
              </div>
            </div>
          </div>

          {/* Holographic shine sweep */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(125deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 50%, rgba(255,255,255,0.06) 70%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: 14,
            zIndex: 3,
          }} />

          {/* Border */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        </div>
      </div>
     </div>
    </div>
  );
});
