'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Menu } from 'lucide-react';
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
    <div className="w-full h-full flex flex-col bg-[#1E1E1E] rounded-lg overflow-hidden">
      {/* Inline toolbar (replaces the fixed TopBar) */}
      <div className="shrink-0 h-12 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidePanel}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle side panel"
          >
            <Menu className="w-4.5 h-4.5 text-gray-50" />
          </button>
          <span className="text-sm font-semibold text-gray-50">
            {(sampleTuitionPolicy as PolicyWorkflow).metadata?.name || 'Policy Playground'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* ReactFlow canvas */}
      <div className="flex-1 min-h-0">
        <ReactFlowProvider>
          <FlowCanvas workflow={sampleTuitionPolicy as PolicyWorkflow} />
          <BottomSheetManager />
          <VendorListModal />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
