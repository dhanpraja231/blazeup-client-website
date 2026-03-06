'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Menu } from 'lucide-react';
import FlowCanvas from './Canvas/FlowCanvas';
import BottomSheetManager from './UI/BottomSheetManager';
import VendorListModal from './Modals/VendorListModal';
import { useTheme } from './hooks/useTheme';
import { useUIStore } from './store/uiStore';
import type { PolicyWorkflow } from './types/flow';

// Lazy load the sample policy data
const loadSamplePolicy = () => import('./data/sample-tuition-policy.json').then(m => m.default);

export default function PolicyPlayground() {
  const { theme, toggleTheme } = useTheme();
  const toggleSidePanel = useUIStore((state) => state.toggleSidePanel);
  const [workflow, setWorkflow] = useState<PolicyWorkflow | null>(null);

  useEffect(() => {
    loadSamplePolicy().then((data) => {
      setWorkflow(data as PolicyWorkflow);
    });
  }, []);

  if (!workflow) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--dark-gray)' }}>
        <div className="text-sm text-white/40">Loading workflow...</div>
      </div>
    );
  }

  const isLight = theme === 'light';

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden" style={{ background: isLight ? '#f8fafc' : 'var(--dark-gray)', transition: 'background 0.3s' }}>
      {/* Inline toolbar */}
      <div className="shrink-0 h-12 flex items-center justify-between px-4" style={{
        background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.02)',
        borderBottom: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.3s, border-bottom 0.3s',
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidePanel}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: isLight ? '#334155' : '#fff' }}
            onMouseEnter={(e) => e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            aria-label="Toggle side panel"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
          <span className="text-sm font-semibold" style={{ color: isLight ? '#0f172a' : '#fff', transition: 'color 0.3s' }}>
            {workflow.metadata?.name || 'Policy Playground'}
          </span>
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlowProvider>
          <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="text-sm text-white/40">Loading canvas...</div></div>}>
            <FlowCanvas workflow={workflow} />
          </Suspense>
          <BottomSheetManager />
          <VendorListModal />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
