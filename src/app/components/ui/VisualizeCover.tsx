'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

// ── Only load one chart at a time via dynamic import ──
const LineGraph = dynamic(
  () => import('@/components/charts/line-graph').then(m => ({ default: m.LineGraph })),
  { ssr: false }
);
const BarGraph = dynamic(
  () => import('@/components/charts/bar-graph').then(m => ({ default: m.BarGraph })),
  { ssr: false }
);
const DonutChart = dynamic(
  () => import('@/components/charts/donut-chart').then(m => ({ default: m.DonutChart })),
  { ssr: false }
);

// ── Sample data ──
const LINE_DATA = [
  { name: 'Jan', value: 22000, budget: 20000 },
  { name: 'Feb', value: 18000, budget: 20000 },
  { name: 'Mar', value: 29000, budget: 21000 },
  { name: 'Apr', value: 25000, budget: 22000 },
  { name: 'May', value: 21000, budget: 22000 },
  { name: 'Jun', value: 28000, budget: 23000 },
  { name: 'Jul', value: 24000, budget: 23000 },
  { name: 'Aug', value: 26500, budget: 24000 },
];

const BAR_DATA = [
  { name: 'Amazon', value: 18500 },
  { name: 'Uber', value: 9200 },
  { name: 'Airbnb', value: 14700 },
  { name: 'WeWork', value: 11300 },
  { name: 'Adobe', value: 7600 },
  { name: 'Starbucks', value: 4800 },
];

const DONUT_DATA = [
  { name: 'Travel', value: 35000 },
  { name: 'Software', value: 22000 },
  { name: 'Hardware', value: 18000 },
  { name: 'Food', value: 12000 },
  { name: 'Other', value: 8000 },
];

const PIE_DATA = [
  { name: 'Q1', value: 42000 },
  { name: 'Q2', value: 38000 },
  { name: 'Q3', value: 31000 },
  { name: 'Q4', value: 27000 },
];

// ── Chart configs ──
interface ChartConfig {
  id: string;
  label: string;
  sweepColor: string;
  sweepFrom: 'left' | 'right' | 'top' | 'bottom';
}

const CHART_CONFIGS: ChartConfig[] = [
  { id: 'line', label: 'Spending Trend', sweepColor: '#0a1a14', sweepFrom: 'left' },
  { id: 'bar', label: 'By Merchant', sweepColor: '#0a1418', sweepFrom: 'right' },
  { id: 'donut', label: 'By Category', sweepColor: '#100a1a', sweepFrom: 'top' },
  { id: 'pie', label: 'Quarterly Split', sweepColor: '#1a120a', sweepFrom: 'bottom' },
];

function ChartRenderer({ chartId }: { chartId: string }) {
  switch (chartId) {
    case 'line':
      return (
        <LineGraph
          data={LINE_DATA}
          xKey="name"
          lines={[
            { key: 'value', name: 'Spending', color: '#10b981' },
            { key: 'budget', name: 'Budget', color: '#6366f1' },
          ]}
          height={260}
        />
      );
    case 'bar':
      return (
        <BarGraph
          data={BAR_DATA}
          xKey="name"
          dataKey="value"
          color="#06b6d4"
          height={260}
        />
      );
    case 'donut':
      return (
        <DonutChart
          data={DONUT_DATA}
          dataKey="value"
          nameKey="name"
          height={260}
        />
      );
    case 'pie':
      return (
        <DonutChart
          data={PIE_DATA}
          dataKey="value"
          nameKey="name"
          height={260}
        />
      );
    default:
      return null;
  }
}

export default function VisualizeCover() {
  const [currentChart, setCurrentChart] = useState(0);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);

  const transition = useCallback((nextIndex: number) => {
    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!curtain || isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const config = CHART_CONFIGS[nextIndex];

    // Set curtain color and starting position
    curtain.style.background = config.sweepColor;

    const sweepIn: Record<string, string> = {};
    const sweepOut: Record<string, string> = {};
    const resetPos: Record<string, string> = {};

    switch (config.sweepFrom) {
      case 'left':
        resetPos.x = '-100%'; resetPos.y = '0%';
        sweepIn.x = '0%'; sweepIn.y = '0%';
        sweepOut.x = '100%'; sweepOut.y = '0%';
        break;
      case 'right':
        resetPos.x = '100%'; resetPos.y = '0%';
        sweepIn.x = '0%'; sweepIn.y = '0%';
        sweepOut.x = '-100%'; sweepOut.y = '0%';
        break;
      case 'top':
        resetPos.x = '0%'; resetPos.y = '-100%';
        sweepIn.x = '0%'; sweepIn.y = '0%';
        sweepOut.x = '0%'; sweepOut.y = '100%';
        break;
      case 'bottom':
        resetPos.x = '0%'; resetPos.y = '100%';
        sweepIn.x = '0%'; sweepIn.y = '0%';
        sweepOut.x = '0%'; sweepOut.y = '-100%';
        break;
    }

    // Position curtain at starting edge
    gsap.set(curtain, { ...resetPos, opacity: 1 });

    // Fade out label
    if (label) gsap.to(label, { opacity: 0, duration: 0.15 });

    // Sweep curtain IN (covers current chart)
    gsap.to(curtain, {
      ...sweepIn,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        // Swap chart while curtain covers everything
        setCurrentChart(nextIndex);

        // Update label text
        if (label) {
          // small delay for React to render
          setTimeout(() => {
            // Sweep curtain OUT (reveals new chart)
            gsap.to(curtain, {
              ...sweepOut,
              duration: 0.3,
              ease: 'power2.inOut',
              delay: 0.08,
              onComplete: () => {
                isAnimatingRef.current = false;
              },
            });

            // Fade label back in
            if (label) {
              gsap.to(label, { opacity: 1, duration: 0.2, delay: 0.15 });
            }
          }, 30);
        }
      },
    });
  }, []);

  useEffect(() => {
    // Auto-cycle every 4 seconds
    const cycle = () => {
      timerRef.current = setTimeout(() => {
        const next = (currentChart + 1) % CHART_CONFIGS.length;
        transition(next);
        cycle();
      }, 3000);
    };

    cycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentChart, transition]);

  const config = CHART_CONFIGS[currentChart];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 20,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Chart label */}
      <div
        ref={labelRef}
        style={{
          padding: '12px 16px 4px',
          flexShrink: 0,
          zIndex: 2,
        }}
      >
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}>
          {config.label}
        </div>
      </div>

      {/* Chart area */}
      <div style={{
        flex: 1,
        padding: '0 8px 8px',
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <ChartRenderer chartId={config.id} />
      </div>

      {/* Color curtain — sweeps across to transition */}
      <div
        ref={curtainRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          opacity: 0,
          borderRadius: 20,
        }}
      />
    </div>
  );
}
