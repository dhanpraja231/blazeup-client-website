'use client';

import dynamic from 'next/dynamic';

// Lazy load VisualizeDashboard for faster initial page load
const VisualizeDashboard = dynamic(() => import('@/components/ui/VisualizeDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dark-gray)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-white/40">Loading Dashboard...</p>
      </div>
    </div>
  ),
});

export default function VisualizePage() {
  return <VisualizeDashboard />;
}
