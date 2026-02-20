'use client';

import { useState, useMemo, useCallback, useId } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts';
import { CHART_THEME, formatCurrency } from './chart-config';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PieChartProps {
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

const GAP_WIDTH = 4; // The size of your true transparent gap

// Active shape — uses a mask to genuinely erase the borders
const renderActiveShape = (props: any) => {
  const { cx, cy, outerRadius, startAngle, endAngle, fill, percent, chartId } = props;
  
  // Generate a strictly unique ID using the chart instance ID and angles
  const maskId = `mask-active-${chartId}-${startAngle}-${endAngle}`.replace(/[^a-zA-Z0-9-]/g, '-');

  const labelAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
  const labelR = outerRadius * 0.6;
  const labelX = cx + labelR * Math.cos(-labelAngle);
  const labelY = cy + labelR * Math.sin(-labelAngle);

  return (
    <g>
      <defs>
        <mask id={maskId}>
          {/* 1. White fills the area, meaning "keep this visible" */}
          <Sector cx={cx} cy={cy} innerRadius={0} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill="#ffffff" />
          {/* 2. Black strokes the border, meaning "erase this path" */}
          <Sector cx={cx} cy={cy} innerRadius={0} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill="none" stroke="#000000" strokeWidth={GAP_WIDTH} strokeLinejoin="round" />
        </mask>
      </defs>

      {/* Outer glow ring (not masked, so it glows behind the gap) */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.18}
      />
      
      {/* Main expanded sector (Masked) */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={0}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        mask={`url(#${maskId})`}
      />
      
      {/* Threshold set to > 0.03 so it shows up on smaller slices */}
      {percent > 0.03 && (
        <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="11px" fontWeight={700} style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )}
    </g>
  );
};

// Default shape — uses a mask to genuinely erase the borders
const renderDefaultShape = (props: any) => {
  const { cx, cy, outerRadius, startAngle, endAngle, fill, percent, chartId } = props;

  // Generate a strictly unique ID using the chart instance ID and angles
  const maskId = `mask-default-${chartId}-${startAngle}-${endAngle}`.replace(/[^a-zA-Z0-9-]/g, '-');

  const labelAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
  const labelR = outerRadius * 0.6;
  const labelX = cx + labelR * Math.cos(-labelAngle);
  const labelY = cy + labelR * Math.sin(-labelAngle);

  return (
    <g>
      <defs>
        <mask id={maskId}>
          {/* 1. White fills the area, meaning "keep this visible" */}
          <Sector cx={cx} cy={cy} innerRadius={0} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill="#ffffff" />
          {/* 2. Black strokes the border, meaning "erase this path" */}
          <Sector cx={cx} cy={cy} innerRadius={0} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill="none" stroke="#000000" strokeWidth={GAP_WIDTH} strokeLinejoin="round" />
        </mask>
      </defs>

      {/* Main sector (Masked) */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={0}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        mask={`url(#${maskId})`}
      />
      
      {/* Threshold set to > 0.03 so it shows up on smaller slices */}
      {percent > 0.03 && (
        <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.75)" fontSize="10px" fontWeight={600} style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )}
    </g>
  );
};

export function PieChartComponent({ data, dataKey, nameKey, height = 300, light = false }: PieChartProps) {
  const chartId = useId(); // Generates a unique ID for this specific chart component instance
  
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [drilldown, setDrilldown] = useState<{ label: string; data: any[] } | null>(null);

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

  const legendSpace = Math.min(50, Math.max(32, activeData.length * 10));
  const chartArea = height - legendSpace - 16;
  const outerRadius = Math.max(30, Math.min(110, chartArea * 0.44));

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
              <Pie
                data={activeData}
                cx="50%"
                cy="52%"
                innerRadius={0}
                outerRadius={outerRadius}
                paddingAngle={0} 
                cornerRadius={0}
                dataKey={activeDataKey}
                nameKey={activeNameKey}
                // Pass the strictly unique chartId down into our custom shape functions
                activeShape={(props: any) => renderActiveShape({ ...props, light, chartId })}
                shape={(props: any) => renderDefaultShape({ ...props, light, chartId })}
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
                      transition: 'opacity 0.3s ease',
                      opacity: activeIndex === undefined || activeIndex === index ? 1 : 0.45,
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
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}