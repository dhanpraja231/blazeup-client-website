'use client';

import React, { Suspense } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Menu, Copy } from 'lucide-react';
import FlowCanvas from './Canvas/FlowCanvas';
import BottomSheetManager from './UI/BottomSheetManager';
import VendorListModal from './Modals/VendorListModal';
import ThemeToggle from './UI/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import { useUIStore } from './store/uiStore';
import sampleTuitionPolicy from './data/sample-tuition-policy.json';
import type { PolicyWorkflow } from './types/flow';

export default function PolicyPlayground() {
  const { theme, toggleTheme } = useTheme();
  const toggleSidePanel = useUIStore((state) => state.toggleSidePanel);

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden" style={{ background: 'var(--dark-gray)' }}>
      {/* Inline toolbar (replaces the fixed TopBar) */}
      <div className="shrink-0 h-12 flex items-center justify-between px-4" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidePanel}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#fff' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Toggle side panel"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <span className="text-sm font-semibold" style={{ color: '#fff' }}>
            {(sampleTuitionPolicy as PolicyWorkflow).metadata?.name || 'Policy Playground'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* TEMP: Copy node positions button */}
          <button
            onClick={() => (window as any).__copyNodePositions?.()}
            className="p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            style={{ color: '#fff', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
            title="Copy node positions (TEMP)"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Positions</span>
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlowProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-sm text-white/40">Loading canvas...</div></div>}>
            <FlowCanvas workflow={sampleTuitionPolicy as PolicyWorkflow} onCopyPositions={() => {}} />
          </Suspense>
          <BottomSheetManager />
          <VendorListModal />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
