'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ── Node data for full animated canvas ──
const NODES = [
  {
    id: 'node1', theme: 'purple', iconUrl: '', title: 'Category Limits',
    bodyTitle: 'Tuition Reimbursement', bodySub: 'per calendar year',
    amount: '₹105,000', extra: '+ Add category',
    left: 40, top: 110, handleY: 80,
  },
  {
    id: 'node2', theme: 'blue', iconUrl: '', title: 'Policy Check',
    bodyTitle: 'Course Approval Requirements', bodySub: '4 items configured',
    footer: 'Approval Required',
    left: 340, top: 70, handleY: 70,
  },
  {
    id: 'node3', theme: 'green', iconUrl: '', title: 'Action',
    bodyTitle: 'Approve Reimbursement', bodySub: 'Tuition reimbursement approved',
    left: 630, top: 80, handleY: 60,
  },
  {
    id: 'node4', theme: 'orange', iconUrl: '', title: 'Condition',
    bodyTitle: 'employment_status', bodySub: '= full_time',
    left: 340, top: 240, handleY: 60,
  },
  {
    id: 'node5', theme: 'dark', iconUrl: '', title: 'Slack',
    titleExtra: '#hr-reimbursements',
    bodyTitle: 'Notify HR & Manager',
    bodySub: 'Tuition reimbursement approved for {employee_name} - ₹{amount}',
    connected: true,
    left: 910, top: 80, handleY: 60,
  },
];

const EDGES = [
  { id: 'line1', d: 'M 284 190 C 310 190, 310 140, 336 140' },
  { id: 'line2', d: 'M 584 140 C 606 140, 606 140, 626 140' },
  { id: 'line3', d: 'M 284 190 C 310 190, 310 300, 336 300' },
  { id: 'line4', d: 'M 584 300 C 606 300, 606 140, 626 140' },
  { id: 'line5', d: 'M 874 140 C 890 140, 890 140, 906 140' },
];

const LABELS = [
  { id: 'label1', text: 'Within limit', left: 275, top: 154 },
  { id: 'label2', text: 'Eligible course', left: 574, top: 118 },
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

// ── Cover nodes (vertical column layout) ──
const COVER_NODES = [
  { title: 'Category Limits', subtitle: '₹105,000 / year', accent: '#8b5cf6', bgAccent: 'rgba(139,92,246,0.08)', borderAccent: 'rgba(139,92,246,0.25)' },
  { title: 'Policy Check', subtitle: '4 rules configured', accent: '#3b82f6', bgAccent: 'rgba(59,130,246,0.08)', borderAccent: 'rgba(59,130,246,0.25)' },
  { title: 'Approve Action', subtitle: 'Auto-reimbursement', accent: '#22c55e', bgAccent: 'rgba(34,197,94,0.08)', borderAccent: 'rgba(34,197,94,0.25)' },
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
  const coverRef = useRef<HTMLDivElement>(null);

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

  // ── Cover idle animation (connecting lines pulse) ──
  useEffect(() => {
    if (isHovered || isExpanded) return;
    const el = coverRef.current;
    if (!el) return;

    const connectors = el.querySelectorAll('.cover-connector');
    const dots = el.querySelectorAll('.cover-dot');

    const tl = gsap.timeline({ repeat: -1 });

    // Pulse dots sequentially
    dots.forEach((dot, i) => {
      tl.to(dot, {
        boxShadow: `0 0 10px ${['#8b5cf6', '#3b82f6', '#22c55e'][i]}60`,
        scale: 1.3,
        duration: 0.5,
        ease: 'power2.out',
      }, i * 1.2);
      tl.to(dot, {
        boxShadow: 'none',
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      }, i * 1.2 + 0.5);
    });

    // Animate connector dashes
    connectors.forEach((conn) => {
      tl.to(conn, {
        strokeDashoffset: -20,
        duration: 1.5,
        ease: 'none',
        repeat: 1,
      }, 0);
    });

    tl.to({}, { duration: 1 });

    return () => { tl.kill(); };
  }, [isHovered, isExpanded]);

  // ── Full canvas animation (unchanged) ──
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
          NODES.forEach(n => {
            const el = scene.querySelector(`#${n.id}`);
            if (el) gsap.set(el, { opacity: 0 });
          });
          EDGES.forEach(e => {
            const el = scene.querySelector(`.${e.id}`);
            if (el) gsap.set(el, { strokeDashoffset: 500 });
          });
          LABELS.forEach(l => {
            const el = scene.querySelector(`#${l.id}`);
            if (el) gsap.set(el, { opacity: 0, scale: 0.5 });
          });
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

  const canvasW = 1180;
  const canvasH = 600;
  const showFullCanvas = isHovered || isExpanded;
  const scale = isExpanded ? 1 : 0.9;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* Empty cover at rest */}
      {!showFullCanvas && (
        <div style={{ width: '100%', height: '100%' }} />
      )}

      {/* ═══ Full animated canvas (shown on hover/expanded) ═══ */}
      <div
        ref={sceneRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: canvasW,
          height: canvasH,
          perspective: 1500,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
              {EDGES.map(e => (
                <path key={e.id} className={e.id} d={e.d}
                  fill="none" stroke="#646a7a" strokeWidth={4}
                  strokeDasharray={500} strokeDashoffset={500} />
              ))}
            </svg>
            {LABELS.map(l => (
              <div key={l.id} id={l.id} style={{
                position: 'absolute', left: l.left, top: l.top,
                background: '#1a1e28', border: '1px solid #3b4256',
                color: '#9ca3af', fontSize: 11, fontWeight: 500,
                padding: '4px 10px', borderRadius: 12, zIndex: 3, opacity: 0,
              }}>{l.text}</div>
            ))}
            {NODES.map(n => {
              const t = THEMES[n.theme];
              return (
                <div key={n.id} id={n.id} style={{
                  position: 'absolute', width: 240, left: n.left, top: n.top,
                  borderRadius: 8, border: `1px solid ${t.border}`, backgroundColor: t.bg,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.4)', zIndex: 2, opacity: 0,
                }}>
                  <div style={{ position: 'absolute', left: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                  {n.id !== 'node5' && (
                    <div style={{ position: 'absolute', right: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: t.headerBg, color: t.headerColor }}>
                    {n.iconUrl ? (
                      <img src={n.iconUrl} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    )}
                    <span>{n.title}</span>
                    {n.titleExtra && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af' }}>{n.titleExtra}</span>}
                  </div>
                  <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#f3f4f6' }}>{n.bodyTitle}</div>
                        <div style={{ fontSize: 11, marginTop: 4, color: t.accent, ...(n.id === 'node5' ? { whiteSpace: 'normal' as const, lineHeight: 1.4, marginTop: 6 } : {}) }}>{n.bodySub}</div>
                      </div>
                      {n.amount && <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{n.amount}</div>}
                    </div>
                    {n.extra && <div style={{ fontSize: 12, fontWeight: 500, color: t.accent, cursor: 'pointer', marginTop: 6 }}>{n.extra}</div>}
                    {n.footer && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>{n.footer}</div>}
                    {n.connected && <div style={{ fontSize: 12, fontWeight: 500, color: '#4ade80', marginTop: 4 }}>● Connected</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══ BACK: Policy Modal ═══ */}
          <div style={{
            width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
            backfaceVisibility: 'hidden',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transform: 'rotateY(180deg)',
          }}>
            <div style={{ width: '100%', maxWidth: 520, borderRadius: 12, backgroundColor: '#16161A', border: '1px solid #2A2B36', padding: 48 }}>
              <div className="modal-anim" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 600 }}>Automated Tuition Policy</h2>
                <div style={{ background: '#2A2B36', color: '#aaa', width: 32, height: 32, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✕</div>
              </div>
              <div className="modal-anim" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ background: '#1B4527', color: '#4ade80', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, border: '1px solid #22c55e' }}>● ACTIVE</span>
                <span style={{ color: '#6b7280', fontSize: 12 }}>Generated from visual flow · Live as of 10/02/2026</span>
              </div>
              <p className="modal-anim" style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #2A2B36', lineHeight: 1.5 }}>
                This automated workflow enforces strict annual budget caps before evaluating specialized curriculum and provider requirements for all organizational reimbursements.
              </p>
              <div className="modal-anim">
                <h4 style={{ color: '#6b7280', fontSize: 12, margin: '0 0 16px 0', letterSpacing: 0.5 }}>IMPLEMENTED LOGIC NODES (5)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                  {MODAL_RULES.map((r, i) => (
                    <div key={i} className="modal-anim" style={{ background: '#1C1D22', border: '1px solid #2A2B36', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, color: '#e5e7eb', fontSize: 13, fontWeight: 500 }}>
                      <div style={{ width: 8, height: 8, background: r.color, borderRadius: '50%', boxShadow: `0 0 8px ${r.color}40` }} />
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-anim" style={{ borderTop: '1px solid #2A2B36', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 6, letterSpacing: 0.5 }}>APPLIES TO GROUPS</span>
                  <span style={{ background: '#1e3a5f', color: '#93c5fd', padding: '6px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, border: '1px solid #3b82f6', whiteSpace: 'nowrap', display: 'inline-block' }}>👥 Global Employees</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', background: '#2A2B36', color: '#fff', cursor: 'pointer' }}>Close Window</button>
                  <button style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>✏️ Edit Builder Flow</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
