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
  glowColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'design',
    label: 'Card Designer',
    description: 'Create stunning credit card designs with AI-powered templates and live preview',
    icon: <Palette className="w-6 h-6" />,
    accentFrom: '#f97316',
    accentTo: '#ec4899',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    description: 'Design and evaluate credit card policy workflows with visual composer',
    icon: <SearchCheck className="w-6 h-6" />,
    accentFrom: '#6366f1',
    accentTo: '#8b5cf6',
    glowColor: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: 'visualize',
    label: 'Visualize',
    description: 'Analyze card spending patterns and view interactive analytics dashboards',
    icon: <BarChart3 className="w-6 h-6" />,
    accentFrom: '#10b981',
    accentTo: '#06b6d4',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
];

/* ═══════════ Main Component ═══════════ */
export default function WorkflowTabs() {
  const [expandedColumn, setExpandedColumn] = useState<ColumnId | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<ColumnId | null>(null);
  const columnRefs = useRef<Record<ColumnId, HTMLDivElement | null>>({
    design: null,
    evaluate: null,
    visualize: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

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

    setHoveredColumn(colId);
    const col = COLUMNS.find(c => c.id === colId)!;

    // Expand hovered column, shrink others
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el) return;

      if (c.id === colId) {
        gsap.to(el, {
          flex: 1.5,
          duration: 0.5,
          ease: 'power3.out',
        });
        // Glow effect
        gsap.to(el, {
          boxShadow: `0 0 40px ${col.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
          borderColor: `rgba(255,255,255,0.15)`,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(el, {
          flex: 0.85,
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

    setHoveredColumn(null);

    // Reset all columns to equal
    COLUMNS.forEach(c => {
      const el = columnRefs.current[c.id];
      if (!el) return;
      gsap.to(el, {
        flex: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        borderColor: 'rgba(255,255,255,0.06)',
        duration: 0.5,
        ease: 'power3.out',
      });
    });
  }, [expandedColumn]);

  const handleExpand = useCallback((colId: ColumnId) => {
    setExpandedColumn(colId);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedColumn(null);
  }, []);

  /* ── Cover content for each column ── */
  const renderCover = (col: ColumnConfig) => {
    const isHovered = hoveredColumn === col.id;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '32px 24px',
          gap: 24,
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

        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${col.glowColor} 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        />



        {/* Special card animation for Design column */}
        {col.id === 'design' && (
          <div style={{ margin: '0' }}>
            <FlippingCardCover />
          </div>
        )}

        {/* Evaluate cover */}
        {col.id === 'evaluate' && (
          <div style={{
            width: '100%',
            maxWidth: 240,
            aspectRatio: '16/10',
            borderRadius: 12,
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Mini flow diagram */}
            <svg width="160" height="90" viewBox="0 0 160 90">
              <defs>
                <linearGradient id="evalGrad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              {/* Nodes */}
              <rect x="5" y="30" width="36" height="28" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
              <rect x="62" y="10" width="36" height="28" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
              <rect x="62" y="52" width="36" height="28" rx="6" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
              <rect x="119" y="30" width="36" height="28" rx="6" fill="rgba(99,102,241,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
              {/* Connectors */}
              <line x1="41" y1="44" x2="62" y2="24" stroke="url(#evalGrad)" strokeWidth="1.5" opacity="0.5" />
              <line x1="41" y1="44" x2="62" y2="66" stroke="url(#evalGrad)" strokeWidth="1.5" opacity="0.5" />
              <line x1="98" y1="24" x2="119" y2="44" stroke="url(#evalGrad)" strokeWidth="1.5" opacity="0.5" />
              <line x1="98" y1="66" x2="119" y2="44" stroke="url(#evalGrad)" strokeWidth="1.5" opacity="0.5" />
              {/* Dots on nodes */}
              <circle cx="23" cy="44" r="3" fill="#6366f1" opacity="0.7" />
              <circle cx="80" cy="24" r="3" fill="#6366f1" opacity="0.7" />
              <circle cx="80" cy="66" r="3" fill="#6366f1" opacity="0.7" />
              <circle cx="137" cy="44" r="3" fill="#8b5cf6" opacity="0.7" />
            </svg>
          </div>
        )}

        {/* Visualize cover — fills entire column */}
        {col.id === 'visualize' && (
          <VisualizeCover />
        )}

        {/* Label — floats at bottom for visualize, centered for others */}
        <div style={{
          textAlign: 'center',
          ...(col.id === 'visualize' ? {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '40px 16px 20px',
            background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 60%, transparent 100%)',
          } : {}),
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}>
            {col.label}
          </h3>
          <p style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.5,
            maxWidth: 220,
            margin: '0 auto',
          }}>
            {col.description}
          </p>
        </div>

        {/* Expand hint */}
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: col.accentFrom,
            opacity: isHovered ? 1 : 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.3 }}
        >
          Click to open <ChevronRight className="w-4 h-4" />
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
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
