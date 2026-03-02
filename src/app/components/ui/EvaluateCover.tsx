'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ── Node data — coordinates designed for ~900×450 expanded column ──
const NODE_W = 195;

const NODES = [
  {
    id: 'node1', theme: 'purple', iconUrl: '', title: 'Category Limits',
    bodyTitle: 'Tuition Reimbursement', bodySub: 'per calendar year',
    amount: '₹105,000', extra: '+ Add category',
    left: 15, top: 80, handleY: 65,
  },
  {
    id: 'node2', theme: 'blue', iconUrl: '', title: 'Policy Check',
    bodyTitle: 'Course Approval Requirements', bodySub: '4 items configured',
    footer: 'Approval Required',
    left: 255, top: 45, handleY: 60,
  },
  {
    id: 'node3', theme: 'green', iconUrl: '', title: 'Action',
    bodyTitle: 'Approve Reimbursement', bodySub: 'Tuition reimbursement approved',
    left: 490, top: 50, handleY: 55,
  },
  {
    id: 'node4', theme: 'orange', iconUrl: '', title: 'Condition',
    bodyTitle: 'employment_status', bodySub: '= full_time',
    left: 255, top: 200, handleY: 55,
  },
  {
    id: 'node5', theme: 'dark', iconUrl: '', title: 'Slack',
    titleExtra: '#hr-reimbursements',
    bodyTitle: 'Notify HR & Manager',
    bodySub: 'Tuition reimbursement approved for {employee_name} - ₹{amount}',
    connected: true,
    left: 710, top: 45, handleY: 55,
  },
];

// Handle positions: right = left + NODE_W + 4, left = left - 4, Y = top + handleY
// node1 right: (214, 145)  node2 left: (251, 105) right: (454, 105)
// node3 left: (486, 105) right: (689, 105)   node4 left: (251, 255) right: (454, 255)
// node5 left: (706, 100)
const EDGES = [
  { id: 'line1', d: 'M 214 145 C 232 145, 232 105, 251 105' },
  { id: 'line2', d: 'M 454 105 C 470 105, 470 105, 486 105' },
  { id: 'line3', d: 'M 214 145 C 232 145, 232 255, 251 255' },
  { id: 'line4', d: 'M 454 255 C 470 255, 470 105, 486 105' },
  { id: 'line5', d: 'M 689 105 C 698 105, 698 100, 706 100' },
];

const LABELS = [
  { id: 'label1', text: 'Within limit', left: 206, top: 85 },
  { id: 'label2', text: 'Eligible course', left: 458, top: 82 },
];

const THEMES: Record<string, { border: string; bg: string; headerBg: string; headerColor: string; accent: string; handleBg: string }> = {
  purple: { border: '#8b5cf6', bg: '#2D2B3D', headerBg: 'rgba(0,0,0,0.15)', headerColor: '#e9d5ff', accent: '#a855f7', handleBg: '#8b5cf6' },
  blue:   { border: '#3b82f6', bg: '#2B3045', headerBg: 'rgba(0,0,0,0.15)', headerColor: '#bfdbfe', accent: '#60a5fa', handleBg: '#3b82f6' },
  green:  { border: '#22c55e', bg: '#25332C', headerBg: 'rgba(0,0,0,0.15)', headerColor: '#bbf7d0', accent: '#22c55e', handleBg: '#22c55e' },
  orange: { border: '#b45309', bg: '#382718', headerBg: 'rgba(0,0,0,0.15)', headerColor: '#fde68a', accent: '#fbbf24', handleBg: '#b45309' },
  dark:   { border: '#4c1d95', bg: '#1a1924', headerBg: 'rgba(0,0,0,0.2)',  headerColor: '#ddd6fe', accent: '#a78bfa', handleBg: '#6b7280' },
};

const MODAL_RULES = [
  { label: 'Category Limit Cap Enforced', color: '#a855f7' },
  { label: 'Employment Status Check', color: '#fbbf24' },
  { label: 'Course Verification Check', color: '#3b82f6' },
  { label: 'Manager Slack Notification', color: '#a78bfa' },
];

interface EvaluateCoverProps {
  isExpanded?: boolean;
  isHovered?: boolean;
  isActive?: boolean;
  onCycleComplete?: () => void;
}

export default function EvaluateCover({ isExpanded = false, isHovered = false, isActive = true, onCycleComplete }: EvaluateCoverProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isHoveredRef = useRef(isHovered);

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

  // ── Full canvas animation ──
  useEffect(() => {
    const scene = sceneRef.current;
    const flipper = flipperRef.current;
    if (!scene || !flipper) return;

    if (tlRef.current) tlRef.current.kill();
    gsap.set(flipper, { rotationY: 0 });

    const tl = gsap.timeline({
      repeat: 0,
      paused: !isActive,
      onComplete: () => {
        if (isHoveredRef.current) {
          NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
          EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
          LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
          gsap.set(modalEls, { y: 15, opacity: 0 });
          gsap.to(flipper, {
            rotationY: 360, duration: 0.8, ease: 'power3.inOut',
            onComplete: () => { gsap.set(flipper, { rotationY: 0 }); tl.restart(); },
          });
        } else {
          if (onCycleComplete) onCycleComplete();
        }
      },
    });
    tlRef.current = tl;

    NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
    EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
    LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
    const modalEls = scene.querySelectorAll('.modal-anim');
    gsap.set(modalEls, { y: 15, opacity: 0 });

    tl.fromTo('#node1', { scale: 1.1, opacity: 0, x: -40, y: -20, rotation: -4 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' });
    tl.fromTo('#node2', { scale: 1.1, opacity: 0, x: 30, y: -20, rotation: 3 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, '+=0.2');
    tl.to('.line1', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' });
    tl.fromTo('#label1', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }, '-=0.1');
    tl.fromTo('#node4', { scale: 1.1, opacity: 0, x: 30, y: -20, rotation: -2 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, '+=0.1');
    tl.to('.line3', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' });
    tl.fromTo('#node3', { scale: 1.1, opacity: 0, x: 30, y: -20, rotation: 3 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, '+=0.1');
    tl.to('.line2, .line4', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' });
    tl.fromTo('#label2', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }, '-=0.1');
    tl.fromTo('#node5', { scale: 1.1, opacity: 0, x: 30, y: -20, rotation: 2 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' }, '+=0.1');
    tl.to('.line5', { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' });
    tl.to({}, { duration: 1 });
    tl.to(flipper, { rotationY: 180, duration: 0.8, ease: 'power3.inOut' });
    tl.to(modalEls, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, '-=0.2');
    tl.to({}, { duration: 2 });

    return () => { tl.kill(); };
  }, [isExpanded]);

  useEffect(() => {
    const tl = tlRef.current;
    const flipper = flipperRef.current;
    const scene = sceneRef.current;
    if (!tl || !flipper || !scene) return;

    if (isActive) {
      NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
      EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
      LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
      const modalEls = scene.querySelectorAll('.modal-anim');
      gsap.set(modalEls, { y: 15, opacity: 0 });
      const currentRotation = gsap.getProperty(flipper, 'rotationY') as number;
      if (currentRotation >= 170) {
        gsap.to(flipper, { rotationY: 360, duration: 0.8, ease: 'power3.inOut',
          onComplete: () => { gsap.set(flipper, { rotationY: 0 }); tl.restart(); },
        });
      } else { gsap.set(flipper, { rotationY: 0 }); tl.restart(); }
    } else { tl.pause(); }
  }, [isActive]);

  const showFullCanvas = isHovered || isExpanded;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* Empty cover at rest */}
      {!showFullCanvas && (
        <div style={{ width: '100%', height: '100%' }} />
      )}

      {/* ═══ Full animated canvas — fills the container natively, no scaling ═══ */}
      <div
        ref={sceneRef}
        style={{
          position: 'absolute',
          inset: 0,
          perspective: 1500,
          transition: 'opacity 0.4s ease',
          ...(showFullCanvas ? {} : { pointerEvents: 'none', opacity: 0 }),
        }}
      >
        <div
          ref={flipperRef}
          style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ═══ FRONT: Node Canvas ═══ */}
          <div style={{
            width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
            backfaceVisibility: 'hidden', borderRadius: 12,
            backgroundColor: '#121318',
            backgroundImage: 'radial-gradient(circle, #383a45 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px', backgroundPosition: '-10px -10px',
            border: '1px solid #2A2B36', overflow: 'hidden',
            transform: 'rotateY(0deg)',
          }}>
            {/* SVG edges */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
              {EDGES.map(e => (
                <path key={e.id} className={e.id} d={e.d}
                  fill="none" stroke="#646a7a" strokeWidth={4}
                  strokeDasharray={500} strokeDashoffset={500} />
              ))}
            </svg>

            {/* Edge labels */}
            {LABELS.map(l => (
              <div key={l.id} id={l.id} style={{
                position: 'absolute', left: l.left, top: l.top,
                background: '#1a1e28', border: '1px solid #3b4256',
                color: '#9ca3af', fontSize: 11, fontWeight: 500,
                padding: '4px 10px', borderRadius: 12, zIndex: 3, opacity: 0,
              }}>{l.text}</div>
            ))}

            {/* Node blocks */}
            {NODES.map(n => {
              const t = THEMES[n.theme];
              return (
                <div key={n.id} id={n.id} style={{
                  position: 'absolute', width: NODE_W, left: n.left, top: n.top,
                  borderRadius: 8, border: `1px solid ${t.border}`, backgroundColor: t.bg,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.4)', zIndex: 2, opacity: 0,
                }}>
                  {/* Handles */}
                  <div style={{ position: 'absolute', left: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                  {n.id !== 'node5' && (
                    <div style={{ position: 'absolute', right: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                  )}
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontSize: 12, fontWeight: 600, backgroundColor: t.headerBg, color: t.headerColor }}>
                    {n.iconUrl ? (
                      <img src={n.iconUrl} alt="" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 18, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    )}
                    <span>{n.title}</span>
                    {n.titleExtra && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ca3af' }}>{n.titleExtra}</span>}
                  </div>
                  {/* Body */}
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#f3f4f6' }}>{n.bodyTitle}</div>
                        <div style={{ fontSize: 10, marginTop: 3, color: t.accent,
                          ...(n.id === 'node5' ? { whiteSpace: 'normal' as const, lineHeight: 1.4, marginTop: 5 } : {}),
                        }}>{n.bodySub}</div>
                      </div>
                      {n.amount && <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{n.amount}</div>}
                    </div>
                    {n.extra && <div style={{ fontSize: 11, fontWeight: 500, color: t.accent, cursor: 'pointer', marginTop: 4 }}>{n.extra}</div>}
                    {n.footer && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 6 }}>{n.footer}</div>}
                    {n.connected && <div style={{ fontSize: 11, fontWeight: 500, color: '#4ade80', marginTop: 3 }}>● Connected</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ BACK: Policy Card — compact, fills the column ═══ */}
          <div style={{
            width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}>
            <div style={{
              width: '100%', height: '100%',
              borderRadius: 12,
              backgroundColor: '#16161A',
              border: '1px solid #2A2B36',
              overflow: 'hidden',
            }}>
            {/* Inner layout — horizontal split */}
            <div style={{
              display: 'flex',
              width: '100%',
              height: '100%',
            }}>
              {/* Left column — policy info */}
              <div style={{
                flex: 1,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid #2A2B36',
                minWidth: 0,
              }}>
                {/* Header row */}
                <div className="modal-anim" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>Automated Tuition Policy</h2>
                  <div style={{ background: '#2A2B36', color: '#aaa', width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>✕</div>
                </div>

                {/* Status badge */}
                <div className="modal-anim" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: '#1B4527', color: '#4ade80', padding: '2px 8px', borderRadius: 10, fontSize: 9, fontWeight: 700, border: '1px solid #22c55e' }}>● ACTIVE</span>
                  <span style={{ color: '#6b7280', fontSize: 10 }}>Live as of 10/02/2026</span>
                </div>

                {/* Description */}
                <p className="modal-anim" style={{
                  color: '#9ca3af', fontSize: 12, margin: 0, marginBottom: 16,
                  paddingBottom: 14, borderBottom: '1px solid #2A2B36', lineHeight: 1.55,
                }}>
                  This automated workflow enforces strict annual budget caps before evaluating specialized curriculum and provider requirements.
                </p>

                {/* Applied group */}
                <div className="modal-anim" style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 9, color: '#6b7280', display: 'block', marginBottom: 5, letterSpacing: 0.5, fontWeight: 600 }}>APPLIES TO</span>
                  <span style={{ background: '#1e3a5f', color: '#93c5fd', padding: '4px 10px', borderRadius: 14, fontSize: 10, fontWeight: 500, border: '1px solid #3b82f6', display: 'inline-block' }}>👥 Global Employees</span>
                </div>

                {/* Buttons */}
                <div className="modal-anim" style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', background: '#2A2B36', color: '#fff', cursor: 'pointer' }}>Close</button>
                  <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>✏️ Edit Flow</button>
                </div>
              </div>

              {/* Right column — logic nodes */}
              <div style={{
                width: 280,
                flexShrink: 0,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <h4 className="modal-anim" style={{ color: '#6b7280', fontSize: 10, margin: '0 0 12px 0', letterSpacing: 0.5, fontWeight: 600 }}>LOGIC NODES (5)</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MODAL_RULES.map((r, i) => (
                    <div key={i} className="modal-anim" style={{
                      background: '#1C1D22', border: '1px solid #2A2B36', borderRadius: 8,
                      padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8,
                      color: '#e5e7eb', fontSize: 11, fontWeight: 500,
                    }}>
                      <div style={{ width: 7, height: 7, background: r.color, borderRadius: '50%', boxShadow: `0 0 6px ${r.color}40`, flexShrink: 0 }} />
                      {r.label}
                    </div>
                  ))}
                </div>

                {/* Source tag */}
                <div className="modal-anim" style={{ marginTop: 14, fontSize: 9, color: '#555', letterSpacing: 0.5 }}>
                  
                </div>
              </div>
              </div>
            </div>
            </div>
          </div>
      </div>
    </div>
  );
}
