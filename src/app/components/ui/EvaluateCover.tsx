'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useTheme } from '@/components/ThemeProvider';

// ── Node data   coordinates designed for ~900×450 expanded column ──
const NODE_W = 195;
const DESIGN_WIDTH = 1300;
const DESIGN_HEIGHT = 450;

const NODES = [
  {
    id: 'node1', theme: 'purple', iconUrl: '', title: 'Category Limits',
    bodyTitle: 'Tuition Reimbursement', bodySub: 'per calendar year',
    amount: '₹105,000', extra: '+ Add category',
    left: 90, top: 80, handleY: 65,
  },
  {
    id: 'node2', theme: 'blue', iconUrl: '', title: 'Policy Check',
    bodyTitle: 'Course Approval Requirements', bodySub: '4 items configured',
    footer: 'Approval Required',
    left: 430, top: 40, handleY: 60,
  },
  {
    id: 'node3', theme: 'green', iconUrl: '', title: 'Action',
    bodyTitle: 'Approve Reimbursement', bodySub: 'Tuition reimbursement approved',
    left: 780, top: 70, handleY: 55,
  },
  {
    id: 'node4', theme: 'orange', iconUrl: '', title: 'Condition',
    bodyTitle: 'employment_status', bodySub: '= full_time',
    left: 430, top: 225, handleY: 55,
  },
  {
    id: 'node5', theme: 'dark', iconUrl: '', title: 'Slack',
    titleExtra: '#hr-reimbursements',
    bodyTitle: 'Notify HR & Manager',
    bodySub: 'Tuition reimbursement approved for {employee_name} - ₹{amount}',
    connected: true,
    left: 1070, top: 85, handleY: 55,
  },
];

const EDGES = [
  { id: 'line1', d: 'M 285 145 C 357 145, 357 100, 430 100' }, // node1 -> node2
  { id: 'line2', d: 'M 625 100 C 703 100, 703 125, 780 125' }, // node2 -> node3
  { id: 'line3', d: 'M 285 145 C 357 145, 357 280, 430 280' }, // node1 -> node4
  { id: 'line4', d: 'M 625 280 C 703 280, 703 125, 780 125' }, // node4 -> node3
  { id: 'line5', d: 'M 975 125 C 1023 125, 1023 140, 1070 140' }, // node3 -> node5
];

const LABELS = [
  { id: 'label1', text: 'Within limit', left: 315, top: 110 },
  { id: 'label2', text: 'Eligible course', left: 660, top: 95 },
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

export default React.memo(function EvaluateCover({ isExpanded = false, isHovered = false, isActive = true, onCycleComplete }: EvaluateCoverProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const { light } = useTheme();
  const flipperRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const coverTlRef = useRef<gsap.core.Timeline | null>(null);
  const isHoveredRef = useRef(isHovered);
  const hasPlayedRef = useRef(false);
  const [isTooSmall, setIsTooSmall] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1);

  // Responsive scale observer for the full canvas
  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleX = width / DESIGN_WIDTH;
        const scaleY = height / DESIGN_HEIGHT;
        const finalScale = Math.min(scaleX, scaleY);
        setCanvasScale(finalScale);
      }
    });

    observer.observe(sceneEl);
    return () => observer.disconnect();
  }, []);

  // Detect truly small viewports (phones)   NOT container resize from hover
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    setIsTooSmall(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTooSmall(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => { isHoveredRef.current = isHovered; }, [isHovered]);

  // ═══ COVER ANIMATION   simple nodes + flow + checkmark ═══
  useEffect(() => {
    const svg = coverRef.current;
    if (!svg) return;

    if (coverTlRef.current) coverTlRef.current.kill();

    const showFullCanvas = isHovered || isExpanded;
    if (showFullCanvas || isTooSmall) {
      return; 
    }
    if (!isActive) {
      svg.querySelectorAll('.cover-card').forEach(el => gsap.set(el, { opacity: 1, y: 0, borderColor: '' }));
      svg.querySelectorAll('.cover-line').forEach(el => gsap.set(el, { strokeDashoffset: 0, opacity: 1 }));
      svg.querySelectorAll('.cover-flow').forEach(el => gsap.set(el, { opacity: 0 }));
      const result = svg.querySelector('.cover-result');
      if (result) gsap.set(result, { opacity: 0 });
      return;
    }

    const cards = svg.querySelectorAll('.cover-card');
    const lines = svg.querySelectorAll('.cover-line');
    const flows = svg.querySelectorAll('.cover-flow');
    const result = svg.querySelector('.cover-result');

    flows.forEach(el => gsap.set(el, { opacity: 0 }));
    if (result) gsap.set(result, { opacity: 0 });

    const isFirstPlay = !hasPlayedRef.current;
    hasPlayedRef.current = true;

    if (isFirstPlay) {
      cards.forEach(el => gsap.set(el, { opacity: 0, y: 20 }));
      lines.forEach(el => gsap.set(el, { strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 }));
    } else {
      cards.forEach(el => gsap.set(el, { opacity: 1, y: 0, borderColor: '' }));
      lines.forEach(el => gsap.set(el, { strokeDasharray: 200, strokeDashoffset: 0, opacity: 1 }));
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (!isHoveredRef.current && onCycleComplete) {
          onCycleComplete();
        }
      },
    });
    coverTlRef.current = tl;

    if (isFirstPlay) {
      tl.to(cards, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)', overwrite: 'auto' });
      tl.to(lines, { strokeDashoffset: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.inOut', overwrite: 'auto' }, '-=0.1');
    }

    const flowEls = Array.from(flows);
    if (flowEls[0]) tl.fromTo(flowEls[0], { attr: { cx: 125, cy: 75 }, opacity: 0 }, { attr: { cx: 145, cy: 185 }, opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1');
    if (flowEls[1]) tl.fromTo(flowEls[1], { attr: { cx: 125, cy: 300 }, opacity: 0 }, { attr: { cx: 145, cy: 185 }, opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.4');
    const leftDots = [flowEls[0], flowEls[1]].filter(Boolean);
    if (leftDots.length) tl.to(leftDots, { opacity: 0, duration: 0.15 });
    if (flowEls[2]) tl.fromTo(flowEls[2], { attr: { cx: 265, cy: 185 }, opacity: 0 }, { attr: { cx: 285, cy: 140 }, opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.1');
    if (flowEls[3]) tl.fromTo(flowEls[3], { attr: { cx: 265, cy: 185 }, opacity: 0 }, { attr: { cx: 285, cy: 260 }, opacity: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.4');
    const rightDots = [flowEls[2], flowEls[3]].filter(Boolean);
    if (rightDots.length) tl.to(rightDots, { opacity: 0, duration: 0.15 });

    tl.to(cards, { borderColor: '#22c55e', duration: 0.3, stagger: 0.05, overwrite: 'auto' }, '-=0.1');
    tl.to([cards, lines], { opacity: 0.15, duration: 0.4, overwrite: 'auto' }, '+=0.3');
    if (result) tl.to(result, { opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }, '-=0.2');
    tl.to({}, { duration: 1 });

    return () => { tl.kill(); };
  }, [isHovered, isExpanded, isActive, isTooSmall]);

  // ═══ FULL CANVAS ANIMATION (on hover) ═══
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (tlRef.current) tlRef.current.kill();

    const fadeTargets = scene.querySelectorAll('.edges-canvas, .node-block, .edge-label');
    const modalEls = scene.querySelectorAll('.modal-anim');
    const blackOverlay = scene.querySelector('.black-overlay');
    const previewBack = scene.querySelector('.preview-back');

    const tl = gsap.timeline({
      repeat: 0,
      paused: true,
      onComplete: () => {
        if (isHoveredRef.current) {
          gsap.set(fadeTargets, { opacity: 1 });
          NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
          EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
          LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
          gsap.set(modalEls, { y: 15, opacity: 0 });
          tl.restart();
        }
      },
    });
    tlRef.current = tl;

    gsap.set(fadeTargets, { opacity: 1 });
    if (blackOverlay) gsap.set(blackOverlay, { width: '0%', left: '0%' });
    if (previewBack) gsap.set(previewBack, { left: '-100%', autoAlpha: 0 });
    NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
    EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
    LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
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

    tl.to(fadeTargets, { opacity: 0, duration: 0.8, ease: 'power2.in' });
    tl.fromTo(blackOverlay, { width: '0%', left: '0%' }, { width: '100%', left: '0%', duration: 1.2, ease: 'power2.inOut' }, '-=0.6');

    tl.fromTo(previewBack, { left: '-100%', autoAlpha: 1 }, { left: '0%', duration: 1, ease: 'power3.out' });

    tl.fromTo(modalEls, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.4');
    
    tl.to({}, { duration: 2 });

    tl.to(previewBack, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' });
    tl.set(previewBack, { left: '-100%' });
    tl.set(blackOverlay, { width: '0%' });

    return () => { tl.kill(); };
  }, [isExpanded]);

  useEffect(() => {
    const tl = tlRef.current;
    const scene = sceneRef.current;
    if (!tl || !scene) return;

    if (isHovered) {
      if (coverTlRef.current) coverTlRef.current.kill();

      const fadeTargets = scene.querySelectorAll('.edges-canvas, .node-block, .edge-label');
      const modalEls = scene.querySelectorAll('.modal-anim');
      const blackOverlay = scene.querySelector('.black-overlay');
      const previewBack = scene.querySelector('.preview-back');

      gsap.set(fadeTargets, { opacity: 1 });
      gsap.set(modalEls, { y: 15, opacity: 0 });
      if (blackOverlay) gsap.set(blackOverlay, { width: '0%', left: '0%' });
      if (previewBack) gsap.set(previewBack, { left: '-100%', autoAlpha: 0 });
      
      NODES.forEach(n => { const el = scene.querySelector(`#${n.id}`); if (el) gsap.set(el, { opacity: 0 }); });
      EDGES.forEach(e => { const el = scene.querySelector(`.${e.id}`); if (el) gsap.set(el, { strokeDashoffset: 500 }); });
      LABELS.forEach(l => { const el = scene.querySelector(`#${l.id}`); if (el) gsap.set(el, { opacity: 0, scale: 0.5 }); });
      
      tl.restart();
    } else {
      tl.pause();
    }
  }, [isHovered]);

  const showFullCanvas = isHovered || isExpanded;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* ═══ Cover Animation   mini card nodes → flow → checkmark ═══ */}
      {!showFullCanvas && (
        <div
          ref={coverRef}
          style={{
            width: '100%', height: '100%',
            position: 'relative',
          }}
        >
          {isTooSmall ? (
            /* ── Mobile fallback: message instead of animation ── */
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: 20,
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500, textAlign: 'center', lineHeight: 1.5 }}>
                View on a larger screen<br/>for the best experience
              </span>
            </div>
          ) : (
            /* ── Scaled SVG cover animation ── */
            <svg
              style={{ width: '100%', height: '100%', display: 'block' }}
              viewBox="0 0 420 360"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connection lines */}
              <line className="cover-line" x1="125" y1="75" x2="145" y2="185" stroke={light ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" />
              <line className="cover-line" x1="125" y1="300" x2="145" y2="185" stroke={light ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" />
              <line className="cover-line" x1="265" y1="185" x2="285" y2="140" stroke={light ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)'} strokeDasharray="200" strokeDashoffset="0" />
              <line className="cover-line" x1="265" y1="185" x2="285" y2="260" stroke={light ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.12)'} strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" />
              {/* Flow dots */}
              <circle className="cover-flow" cx="125" cy="75" r="4" fill="#3b82f6" opacity="0" style={{ filter: 'drop-shadow(0 0 6px #3b82f6)' }} />
              <circle className="cover-flow" cx="125" cy="300" r="4" fill="#3b82f6" opacity="0" style={{ filter: 'drop-shadow(0 0 6px #3b82f6)' }} />
              <circle className="cover-flow" cx="265" cy="185" r="4" fill="#22c55e" opacity="0" style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }} />
              <circle className="cover-flow" cx="265" cy="185" r="4" fill="#22c55e" opacity="0" style={{ filter: 'drop-shadow(0 0 6px #22c55e)' }} />

              {/* Card 1   Category Limits (purple) */}
              <foreignObject className="cover-card" x="15" y="50" width="110" height="55" style={{ overflow: 'visible' }}>
                <div style={{ width: 110, borderRadius: 6, border: '1px solid #8b5cf6', background: '#2D2B3D', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#e9d5ff' }}>Category Limits</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ height: 3, width: '75%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '50%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  </div>
                </div>
              </foreignObject>

              {/* Card 2   Condition (orange) */}
              <foreignObject className="cover-card" x="15" y="275" width="110" height="55" style={{ overflow: 'visible' }}>
                <div style={{ width: 110, borderRadius: 6, border: '1px solid #b45309', background: '#382718', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#fde68a' }}>Condition</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ height: 3, width: '65%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  </div>
                </div>
              </foreignObject>

              {/* Card 3   Policy Check (blue) */}
              <foreignObject className="cover-card" x="145" y="155" width="120" height="70" style={{ overflow: 'visible' }}>
                <div style={{ width: 120, borderRadius: 6, border: '1px solid #3b82f6', background: '#2B3045', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#bfdbfe' }}>Policy Check</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ height: 3, width: '80%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '55%', background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '35%', background: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
                  </div>
                </div>
              </foreignObject>

              {/* Card 4   Action (green) */}
              <foreignObject className="cover-card" x="285" y="115" width="110" height="55" style={{ overflow: 'visible' }}>
                <div style={{ width: 110, borderRadius: 6, border: '1px solid #22c55e', background: '#25332C', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#bbf7d0' }}>Action</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ height: 3, width: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '45%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  </div>
                </div>
              </foreignObject>

              {/* Card 5   Notify (dark) */}
              <foreignObject className="cover-card" x="285" y="235" width="110" height="55" style={{ overflow: 'visible' }}>
                <div style={{ width: 110, borderRadius: 6, border: '1px solid #4c1d95', background: '#1a1924', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ padding: '5px 8px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 8, fontWeight: 600, color: '#ddd6fe' }}>Notify</span>
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ height: 3, width: '60%', background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 4 }} />
                    <div style={{ height: 3, width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                  </div>
                </div>
              </foreignObject>

              {/* Checkmark result overlay */}
              <foreignObject className="cover-result" x="0" y="0" width="420" height="360" style={{ pointerEvents: 'none', opacity: 0 }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: light ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.1)', border: light ? '2px solid rgba(34,197,94,0.6)' : '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <polyline points="7,14 12,20 21,9" stroke={light ? '#16a34a' : '#22c55e'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ color: light ? '#0f172a' : '#fff', fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Transaction Verified</span>
                </div>
              </foreignObject>
            </svg>
          )}
        </div>
      )}

      {/* ═══ Full animated canvas (shown on hover/expanded) ═══ */}
      <div
        ref={sceneRef}
        style={{
          position: 'absolute',
          inset: 0,
          transition: 'opacity 0.4s ease',
          overflow: 'hidden',
          borderRadius: 12,
          ...(showFullCanvas ? {} : { pointerEvents: 'none', opacity: 0 }),
        }}
      >
        <div
          ref={flipperRef}
          style={{
            width: '100%', height: '100%', position: 'relative',
          }}
        >
          {/* ═══ FRONT: Node Canvas (Virtual Scale Approach) ═══ */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: '#121318',
            backgroundImage: 'radial-gradient(circle, #383a45 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px', backgroundPosition: '-10px -10px',
            border: '1px solid #2A2B36',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* VIRTUAL CANVAS WRAPPER */}
            <div style={{
              position: 'relative',
              width: DESIGN_WIDTH,
              height: DESIGN_HEIGHT,
              transform: `scale(${canvasScale})`,
              transformOrigin: 'center center',
              flexShrink: 0
            }}>
              <svg className="edges-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                {EDGES.map(e => (
                  <path key={e.id} className={e.id} d={e.d}
                    fill="none" stroke="#646a7a" strokeWidth={4}
                    strokeDasharray={500} strokeDashoffset={500} />
                ))}
              </svg>
              {LABELS.map(l => (
                <div key={l.id} id={l.id} className="edge-label" style={{
                  position: 'absolute', left: l.left, top: l.top,
                  background: '#1a1e28', border: '1px solid #3b4256',
                  color: '#9ca3af', fontSize: 11, fontWeight: 500,
                  padding: '4px 10px', borderRadius: 12, zIndex: 3, opacity: 0,
                }}>{l.text}</div>
              ))}
              {NODES.map(n => {
                const t = THEMES[n.theme];
                return (
                  <div key={n.id} id={n.id} className="node-block" style={{
                    position: 'absolute', width: NODE_W, left: n.left, top: n.top,
                    borderRadius: 8, border: `1px solid ${t.border}`, backgroundColor: t.bg,
                    boxShadow: '0 12px 24px rgba(0,0,0,0.4)', zIndex: 2, opacity: 0,
                  }}>
                    <div style={{ position: 'absolute', left: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                    {n.id !== 'node5' && (
                      <div style={{ position: 'absolute', right: -7, top: n.handleY, transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: t.handleBg, border: `2px solid ${t.bg}`, zIndex: 5 }} />
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', borderTopLeftRadius: 8, borderTopRightRadius: 8, fontSize: 12, fontWeight: 600, backgroundColor: t.headerBg, color: t.headerColor }}>
                      {n.iconUrl ? (
                        <img src={n.iconUrl} alt="" style={{ width: 18, height: 18, borderRadius: 4, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 18, height: 18, borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px dashed rgba(255,255,255,0.2)' }} />
                      )}
                      <span>{n.title}</span>
                      {n.titleExtra && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#9ca3af' }}>{n.titleExtra}</span>}
                    </div>
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
          </div>

          {/* ═══ BLACK OVERLAY ═══ */}
          <div className="black-overlay" style={{
            position: 'absolute', inset: 0, background: 'black', zIndex: 3, width: '0%', left: 0
          }} />

          {/* ═══ BACK: Policy Card ═══ */}
          <div className="preview-back" style={{
            width: '100%', height: '100%', position: 'absolute', top: 0, left: '-100%',
            visibility: 'hidden', opacity: 0, zIndex: 4,
          }}>
            <div style={{
              width: '100%', height: '100%',
              backgroundColor: '#16161A',
              overflow: 'hidden',
            }}>
            {/* Inner layout   horizontal split */}
            <div style={{
              display: 'flex',
              width: '100%',
              height: '100%',
            }}>
              {/* Left column   policy info */}
              <div style={{
                flex: 1,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRight: '1px solid #2A2B36',
                minWidth: 0,
              }}>
                <div className="modal-anim" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>Automated Tuition Policy</h2>
                  <div style={{ background: '#2A2B36', color: '#aaa', width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginLeft: 12 }}>✕</div>
                </div>
                <div className="modal-anim" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ background: '#1B4527', color: '#4ade80', padding: '2px 8px', borderRadius: 10, fontSize: 9, fontWeight: 700, border: '1px solid #22c55e' }}>● ACTIVE</span>
                  <span style={{ color: '#6b7280', fontSize: 10 }}>Live as of 10/02/2026</span>
                </div>
                <p className="modal-anim" style={{ color: '#9ca3af', fontSize: 12, margin: 0, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #2A2B36', lineHeight: 1.55 }}>
                  This automated workflow enforces strict annual budget caps before evaluating specialized curriculum and provider requirements.
                </p>
                <div className="modal-anim" style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 9, color: '#6b7280', display: 'block', marginBottom: 5, letterSpacing: 0.5, fontWeight: 600 }}>APPLIES TO</span>
                  <span style={{ background: '#1e3a5f', color: '#93c5fd', padding: '4px 10px', borderRadius: 14, fontSize: 10, fontWeight: 500, border: '1px solid #3b82f6', display: 'inline-block' }}>👥 Global Employees</span>
                </div>
                <div className="modal-anim" style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', background: '#2A2B36', color: '#fff', cursor: 'pointer' }}>Close</button>
                  <button style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>✏️ Edit Flow</button>
                </div>
              </div>

              {/* Right column   logic nodes */}
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
});