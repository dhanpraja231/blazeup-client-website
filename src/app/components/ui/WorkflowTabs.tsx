'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  SearchCheck,
  BarChart3,
  Palette,
  Loader2,
  X,
  ChevronRight,
} from 'lucide-react';
import CreditCardDesigner from './credit-card-designer';
import FlippingCardCover from './FlippingCardCover';
import VisualizeCover from './VisualizeCover';
import EvaluateCover from './EvaluateCover';

const PolicyPlayground = dynamic(
  () => import('@/components/composer/PolicyPlayground'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    ),
  }
);

const VisualizeDashboard = dynamic(
  () => import('@/components/ui/VisualizeDashboard'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-white/30 animate-spin" />
      </div>
    ),
  }
);

type ColumnId = 'design' | 'evaluate' | 'visualize';

interface ColumnConfig {
  id: ColumnId;
  label: string;
  description: string;
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'design',
    label: 'Design',
    description: 'Create stunning credit card designs with AI-powered templates and live preview',
    icon: <Palette className="w-6 h-6" />,
    accentFrom: '#f97316',
    accentTo: '#ec4899',
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    description: 'Design and evaluate credit card policy workflows with visual composer',
    icon: <SearchCheck className="w-6 h-6" />,
    accentFrom: '#6366f1',
    accentTo: '#8b5cf6',
  },
  {
    id: 'visualize',
    label: 'Visualize',
    description: 'Analyze card spending patterns and view interactive analytics dashboards',
    icon: <BarChart3 className="w-6 h-6" />,
    accentFrom: '#10b981',
    accentTo: '#06b6d4',
  },
];

/* ═══════════ Main Component ═══════════ */
export default function WorkflowTabs() {
  const [expandedColumn, setExpandedColumn] = useState<ColumnId | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<ColumnId | null>(null);
  const [activeAnimCol, setActiveAnimCol] = useState<ColumnId>('design');
  const isHoveringRef = useRef(false);
  const columnRefs = useRef<Record<ColumnId, HTMLDivElement | null>>({
    design: null,
    evaluate: null,
    visualize: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const ANIM_ORDER: ColumnId[] = ['design', 'evaluate', 'visualize'];

  // Callback: advance to next column when current finishes a cycle
  const advanceAnimation = useCallback(() => {
    if (isHoveringRef.current) return; // Don't advance while hovering
    setActiveAnimCol(prev => {
      const idx = ANIM_ORDER.indexOf(prev);
      return ANIM_ORDER[(idx + 1) % ANIM_ORDER.length];
    });
  }, []);

  // Highlight active animation column border subtly
  useEffect(() => {
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el || hoveredColumn) return;
      if (c.id === activeAnimCol) {
        gsap.to(el, {
          borderColor: 'rgba(255,255,255,0.12)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          borderColor: 'rgba(255,255,255,0.06)',
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    });
  }, [activeAnimCol, hoveredColumn]);

  // Close on Escape
  useEffect(() => {
    if (!expandedColumn) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedColumn(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [expandedColumn]);

  // Lock body scroll when expanded
  useEffect(() => {
    if (expandedColumn) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expandedColumn]);

  // GSAP hover animation for columns
  const handleColumnHover = useCallback((colId: ColumnId) => {
    if (expandedColumn) return; // don't animate hover when one is expanded

    isHoveringRef.current = true;
    setHoveredColumn(colId);
    setActiveAnimCol(colId); // Override animation cycle on hover
    const col = COLUMNS.find(c => c.id === colId)!;

    // Evaluate column takes over the entire row
    const isEvaluate = colId === 'evaluate';

    // Expand hovered column, shrink others
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el) return;

      if (c.id === colId) {
        gsap.to(el, {
          flex: isEvaluate ? 6 : 1.5,
          duration: 0.5,
          ease: 'power3.out',
        });
        // Subtle border highlight on hover (no glow)
        gsap.to(el, {
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderColor: 'rgba(255,255,255,0.15)',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          flex: isEvaluate ? 0.15 : 0.85,
          opacity: isEvaluate ? 0 : 1,
          duration: 0.5,
          ease: 'power3.out',
        });
        gsap.to(el, {
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          borderColor: 'rgba(255,255,255,0.06)',
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    });
  }, [expandedColumn]);

  const handleColumnLeave = useCallback(() => {
    if (expandedColumn) return;

    isHoveringRef.current = false;
    setHoveredColumn(null);

    // Reset all columns to equal — single tween for smooth return
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el) return;
      gsap.to(el, {
        flex: 1,
        opacity: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderColor: 'rgba(255,255,255,0.06)',
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: true,
      });
    });
  }, [expandedColumn]);

  const handleExpand = useCallback((colId: ColumnId) => {
    setExpandedColumn(colId);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedColumn(null);
    isHoveringRef.current = false;
    setHoveredColumn(null);

    // Reset all columns to default state
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el) return;
      gsap.to(el, {
        flex: 1,
        opacity: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderColor: 'rgba(255,255,255,0.06)',
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: true,
      });
    });
  }, []);

  /* ── Cover content for each column ── */
  const renderCover = (col: ColumnConfig) => {
    const isHovered = hoveredColumn === col.id;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => handleExpand(col.id)}
      >
        {/* Background gradient accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${col.accentFrom}, ${col.accentTo})`,
            opacity: isHovered ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        />



        {/* Content area — fills available space above label */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          overflow: 'hidden',
          padding: '16px 12px 0',
        }}>
          {/* Special card animation for Design column */}
          {col.id === 'design' && (
            <div style={{ margin: '0' }}>
              <FlippingCardCover isActive={activeAnimCol === 'design'} onCycleComplete={advanceAnimation} />
            </div>
          )}

          {/* Evaluate cover — empty at rest, animated on hover */}
          {col.id === 'evaluate' && (
            <EvaluateCover isHovered={hoveredColumn === 'evaluate'} isActive={activeAnimCol === 'evaluate'} onCycleComplete={advanceAnimation} />
          )}

          {/* Visualize cover — hide charts when evaluate is hovered */}
          {col.id === 'visualize' && (
            hoveredColumn === 'evaluate' ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                opacity: 0.3,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 16l4-8 4 4 5-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <VisualizeCover isActive={activeAnimCol === 'visualize'} onCycleComplete={advanceAnimation} />
            )
          )}
        </div>

        {/* Label — always pinned at bottom */}
        <div style={{
          flexShrink: 0,
          textAlign: 'center',
          padding: '16px 16px 20px',
        }}>
          <h3 style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 0,
            letterSpacing: '-0.02em',
          }}>
            {col.label}
          </h3>
        </div>

        {/* Expand hint */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: col.accentFrom,
            opacity: isHovered ? 1 : 0,
            paddingBottom: 16,
          }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.3 }}
        >
          Try Here <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>
    );
  };

  /* ── Expanded full-screen overlay ── */
  const renderExpandedView = () => {
    if (!expandedColumn) return null;
    const col = COLUMNS.find(c => c.id === expandedColumn)!;

    return (
      <AnimatePresence>
        <motion.div
          key="expanded-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99998,
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: '#0f0f0f',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Column selector pills */}
              <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {COLUMNS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setExpandedColumn(c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      background: expandedColumn === c.id
                        ? `linear-gradient(135deg, ${c.accentFrom}25, ${c.accentTo}25)`
                        : 'transparent',
                      color: expandedColumn === c.id ? '#fff' : 'rgba(255,255,255,0.5)',
                      outline: expandedColumn === c.id ? `1px solid rgba(255,255,255,0.1)` : 'none',
                    }}
                  >
                    {c.icon}
                    <span style={{ display: 'inline' }}>{c.label}</span>
                  </button>
                ))}
              </div>

              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                {col.description}
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              <X style={{ width: 16, height: 16 }} />
              Close
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <AnimatePresence mode="wait">
              {expandedColumn === 'design' && (
                <motion.div
                  key="design-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', overflow: 'auto' }}
                >
                  <CreditCardDesigner />
                </motion.div>
              )}

              {expandedColumn === 'evaluate' && (
                <motion.div
                  key="evaluate-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%' }}
                >
                  <PolicyPlayground />
                </motion.div>
              )}

              {expandedColumn === 'visualize' && (
                <motion.div
                  key="visualize-content"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', overflow: 'auto' }}
                >
                  <VisualizeDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <>
      {/* ─── 3-Column Section ─── */}
      <section id="product" className="w-full py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Your{' '}Workflow
              </h2>
              <p className="text-white/50 max-w-2xl text-lg">
                Design, evaluate, and visualize — everything you need to manage
                your card program in one place.
              </p>
            </motion.div>
          </div>

          {/* 3-Column Grid */}
          <div
            ref={containerRef}
            onMouseLeave={handleColumnLeave}
            style={{
              display: 'flex',
              gap: 16,
              minHeight: 520,
            }}
          >
            {COLUMNS.map((col, idx) => (
              <motion.div
                key={col.id}
                ref={(el) => { columnRefs.current[col.id] = el; }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.5 }}
                viewport={{ once: true }}
                onMouseEnter={() => handleColumnHover(col.id)}
                style={{
                  flex: 1,
                  borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'none',
                  willChange: 'flex, box-shadow',
                }}
              >
                {renderCover(col)}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Expanded Fullscreen Overlay ─── */}
      {renderExpandedView()}
    </>
  );
}
