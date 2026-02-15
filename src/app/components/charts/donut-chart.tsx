'use client';

import { useState, useMemo, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts';
import { CHART_THEME, formatCurrency } from './chart-config';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonutChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  light?: boolean;
}

const COLORS = [
  CHART_THEME.colors.primary,
  CHART_THEME.colors.secondary,
  CHART_THEME.colors.success,
  CHART_THEME.colors.warning,
  CHART_THEME.colors.danger,
];

const SUB_COLORS = [
  '#22d3ee', '#a78bfa', '#34d399', '#fbbf24', '#f87171',
  '#60a5fa', '#c084fc', '#4ade80', '#fb923c', '#e879f9',
];

// Generate fake sub-segments for drilldown
function generateSubSegments(label: string, total: number) {
  const subNames: Record<string, string[]> = {
    Travel: ['Flights', 'Hotels', 'Taxis', 'Meals'],
    Software: ['Licenses', 'SaaS', 'Cloud', 'Tools'],
    Hardware: ['Laptops', 'Monitors', 'Peripherals', 'Networks'],
    Food: ['Catering', 'Snacks', 'Beverages', 'Events'],
    Marketing: ['Ads', 'Events', 'Content', 'PR'],
    Engineering: ['Infra', 'Tooling', 'Training', 'Misc'],
    Sales: ['CRM', 'Meetings', 'Demos', 'Travel'],
    Operations: ['Facilities', 'Supplies', 'Logistics', 'Maintenance'],
  };
  const names = subNames[label] || ['Item A', 'Item B', 'Item C', 'Item D'];
  let remaining = total;
  return names.map((name, i) => {
    const isLast = i === names.length - 1;
    const val = isLast ? remaining : Math.floor(total / names.length + (Math.random() * total * 0.1 - total * 0.05));
    remaining -= val;
    return { name, value: Math.max(val, 0) };
  });
}

// Smooth active shape renderer — uses a gentle expand with CSS transitions
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
    percent,
  } = props;

  return (
    <g>
      {/* Glow shadow layer */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 1}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.15}
      />
      {/* Main expanded sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Percentage label on the sector */}
      {percent > 0.05 && (
        <text
          x={cx + (outerRadius + innerRadius) / 2 * Math.cos(-((startAngle + endAngle) / 2) * Math.PI / 180)}
          y={cy + (outerRadius + innerRadius) / 2 * Math.sin(-((startAngle + endAngle) / 2) * Math.PI / 180)}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#fff"
          fontSize="10px"
          fontWeight={700}
          style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )}
    </g>
  );
};

export function DonutChart({ data, dataKey, nameKey, height = 300, light = false }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [drilldown, setDrilldown] = useState<{ label: string; data: any[] } | null>(null);

  // Memoize sub-segments
  const subCache = useMemo(() => {
    const cache: Record<string, any[]> = {};
    data.forEach((d) => {
      cache[d[nameKey]] = generateSubSegments(d[nameKey], d[dataKey]);
    });
    return cache;
  }, [data, nameKey, dataKey]);

  const activeData = drilldown ? drilldown.data : data;
  const activeNameKey = drilldown ? 'name' : nameKey;
  const activeDataKey = drilldown ? 'value' : dataKey;
  const activeColors = drilldown ? SUB_COLORS : COLORS;

  const total = activeData.reduce((sum: number, d: any) => sum + d[activeDataKey], 0);

  // Dynamic radii based on height
  const legendSpace = Math.min(50, Math.max(32, activeData.length * 10));
  const chartArea = height - legendSpace - 16;
  const outerRadius = Math.max(30, Math.min(90, chartArea * 0.38));
  const innerRadius = Math.max(18, outerRadius * 0.72);

  const handlePieClick = useCallback((_: any, index: number) => {
    if (drilldown) return;
    const label = data[index][nameKey];
    setDrilldown({ label, data: subCache[label] });
    setActiveIndex(undefined);
  }, [drilldown, data, nameKey, subCache]);

  const handleMouseEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const handleBack = useCallback(() => {
    setDrilldown(null);
    setActiveIndex(undefined);
  }, []);

  return (
    <div style={{ width: '100%', height: height + 24, position: 'relative' }}>
      {/* Drilldown header */}
      <AnimatePresence>
        {drilldown && (
          <motion.div
            className="flex items-center justify-between mb-1 px-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <span
              className="text-[11px] font-semibold"
              style={{ color: light ? '#475569' : 'rgba(255,255,255,0.5)' }}
            >
              {drilldown.label} — Breakdown
            </span>
            <button
              onClick={handleBack}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all duration-200"
              style={{
                background: light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                color: light ? '#475569' : 'rgba(255,255,255,0.6)',
                border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={drilldown ? drilldown.label : '__root__'}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ width: '100%', height }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {activeColors.map((color, i) => (
                  <filter key={`glow-${i}`} id={`donut-glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feFlood floodColor={color} floodOpacity="0.3" />
                    <feComposite in2="blur" operator="in" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                ))}
              </defs>
              <Pie
                data={activeData}
                cx="50%"
                cy="45%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={outerRadius < 50 ? 3 : 4}
                cornerRadius={3}
                dataKey={activeDataKey}
                nameKey={activeNameKey}
                stroke="none"
                {...({ activeIndex } as any)}
                activeShape={renderActiveShape}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handlePieClick}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
                isAnimationActive={true}
                style={{ cursor: drilldown ? 'default' : 'pointer', outline: 'none' }}
              >
                {activeData.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeColors[index % activeColors.length]}
                    style={{
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      opacity: activeIndex === undefined || activeIndex === index ? 1 : 0.5,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                animationDuration={200}
                animationEasing="ease-out"
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="rounded-xl border p-3 shadow-xl z-50 backdrop-blur-md"
                      style={{
                        background: light ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
                        borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: payload[0].payload.fill,
                            boxShadow: `0 0 6px ${payload[0].payload.fill}`,
                          }}
                        />
                        <span className="text-sm font-bold" style={{ color: light ? '#1e293b' : '#fff' }}>
                          {payload[0].name}: {formatCurrency(payload[0].value as number)}
                        </span>
                      </div>
                      {!drilldown && (
                        <p className="mt-1 text-[10px] italic" style={{ color: light ? '#94a3b8' : 'rgba(255,255,255,0.3)' }}>
                          Click to drill down
                        </p>
                      )}
                    </motion.div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: '10px',
                  lineHeight: '16px',
                  paddingTop: '4px',
                  overflow: 'hidden',
                }}
                formatter={(value: string) => (
                  <span style={{ color: light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontSize: '10px', marginRight: '8px' }}>
                    {value.length > 10 ? value.slice(0, 10) + '…' : value}
                  </span>
                )}
              />

              {/* Center text */}
              <text
                x="50%"
                y="42%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: outerRadius > 60 ? '18px' : '14px',
                  fontWeight: 800,
                  fill: light ? '#0f172a' : '#fff',
                  transition: 'all 0.3s ease',
                }}
              >
                {formatCurrency(total)}
              </text>
              <text
                x="50%"
                y={outerRadius > 60 ? '49%' : '50%'}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: '9px',
                  fontWeight: 500,
                  fill: light ? '#94a3b8' : 'rgba(255,255,255,0.35)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase' as const,
                  transition: 'all 0.3s ease',
                }}
              >
                TOTAL
              </text>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
