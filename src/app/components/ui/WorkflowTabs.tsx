'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  SearchCheck,
  BarChart3,
  ArrowRight,
  Palette,
  LayoutDashboard,
  TrendingUp,
  PieChart,
  LineChart,
  Loader2,
  Maximize2,
  X,
} from 'lucide-react';
import CreditCardDesigner from './credit-card-designer';

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

type TabId = 'design' | 'evaluate' | 'visualize';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TABS: Tab[] = [
  {
    id: 'design',
    label: 'Design',
    icon: <Palette className="w-5 h-5" />,
    description: 'Create stunning credit card designs',
  },
  {
    id: 'evaluate',
    label: 'Evaluate',
    icon: <SearchCheck className="w-5 h-5" />,
    description: 'Design and evaluate card policy workflows',
  },
  {
    id: 'visualize',
    label: 'Visualize',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Analyze card spending patterns',
  },
];

/* ─────────── Visualize Preview ─────────── */
function VisualizePreview() {
  const router = useRouter();

  const previewWidgets = [
    { icon: <BarChart3 className="w-6 h-6" />, label: 'Bar Chart' },
    { icon: <LineChart className="w-6 h-6" />, label: 'Line Chart' },
    { icon: <PieChart className="w-6 h-6" />, label: 'Pie Chart' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'KPI Cards' },
  ];

  return (
    <div className="flex flex-col items-center py-20 px-8">
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--electric-blue)]/20 to-[var(--rich-purple)]/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
          <LayoutDashboard className="w-10 h-10 text-white/60" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3">
        Spending Analytics Dashboard
      </h3>
      <p className="text-white/50 text-center max-w-lg leading-relaxed mb-10">
        Visualize how the credit cards issued by your company are used.
        Customize the dashboard by dragging and dropping chart widgets into your
        preferred layout.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-lg">
        {previewWidgets.map((w) => (
          <div
            key={w.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-colors duration-300"
          >
            <span className="text-white/40">{w.icon}</span>
            <span className="text-xs text-white/40 font-medium">{w.label}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push('/visualize')}
        className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white
                   bg-gradient-to-r from-[var(--electric-blue)] to-[var(--rich-purple)]
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-shadow duration-300"
      >
        Open Dashboard
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

/* ═══════════ Main Component ═══════════ */
export default function WorkflowTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('design');
  const [isExpanded, setIsExpanded] = useState(false);

  const closeExpanded = useCallback(() => setIsExpanded(false), []);

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isExpanded]);

  // Escape key to close
  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeExpanded();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isExpanded, closeExpanded]);

  /* ── Tab bar ── */
  const renderTabBar = () => (
    <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200
              ${isActive ? 'text-white' : 'text-white/50 hover:text-white/70'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--blaze-orange)]/25 to-[var(--rich-purple)]/25 border border-white/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );

  /* ── Tab content ── */
  const renderContent = (expanded: boolean) => (
    <AnimatePresence mode="wait">
      {activeTab === 'design' && (
        <motion.div
          key="design"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className={expanded ? 'h-full overflow-auto' : ''}
        >
          <CreditCardDesigner />
        </motion.div>
      )}

      {activeTab === 'evaluate' && (
        <motion.div
          key="evaluate"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className={expanded ? 'h-full' : 'h-[80vh]'}
        >
          <PolicyPlayground />
        </motion.div>
      )}

      {activeTab === 'visualize' && (
        <motion.div
          key="visualize"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className={expanded ? 'h-full overflow-auto' : ''}
        >
          <VisualizePreview />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* ─── Fixed Expand/Collapse FAB ─── */}
      {/* This button uses position:fixed and sits at z-index 99999 so it's
          always clickable, even when the CreditCardDesigner's template modal
          (z-300) is open and covering the page. */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        type="button"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          borderRadius: 16,
          background: isExpanded
            ? 'rgba(239, 68, 68, 0.9)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
        }}
      >
        {isExpanded ? (
          <>
            <X style={{ width: 18, height: 18 }} />
            Close
          </>
        ) : (
          <>
            <Maximize2 style={{ width: 18, height: 18 }} />
            Expand
          </>
        )}
      </button>

      {/* ─── Normal inline section ─── */}
      {!isExpanded && (
        <section className="w-full py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Your{' '}
                  <span className="text-gradient-animated">Workflow</span>
                </h2>
                <p className="text-white/50 max-w-2xl text-lg">
                  Design, evaluate, and visualize — everything you need to manage
                  your card program in one place.
                </p>
              </motion.div>
            </div>

            {/* Tab bar */}
            <div className="flex justify-center mb-8">
              {renderTabBar()}
            </div>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={activeTab + '-desc'}
                className="text-center text-white/40 text-sm mb-8"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {TABS.find((t) => t.id === activeTab)?.description}
              </motion.p>
            </AnimatePresence>

            {/* Content area */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
              {renderContent(false)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Fullscreen overlay ─── */}
      {isExpanded && (
        <div
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
          {/* Single compact header: tabs left, description right */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: '#0f0f0f',
            }}
          >
            {renderTabBar()}
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
              {TABS.find((t) => t.id === activeTab)?.description}
            </span>
          </div>

          {/* Content fills remaining space */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
