'use client';

import { useState, useMemo, useCallback, useId, useRef } from 'react';
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

const GAP_WIDTH = 4;
// Scale factor applied to the active slice   CSS transition animates this smoothly
const ACTIVE_SCALE = 1.06;

const renderCustomShape = (props: any) => {
  const { cx, cy, outerRadius, startAngle, endAngle, fill, percent, chartId, index, activeIndexRef } = props;

  const activeIndex = activeIndexRef.current;
  const isActive = activeIndex === index;
  const isDimmed = activeIndex !== undefined && activeIndex !== index;

  const maskId = `mask-${chartId}-${index}`.replace(/[^a-zA-Z0-9-]/g, '-');

  const centerX = Number(cx) || 0;
  const centerY = Number(cy) || 0;
  const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);

  const labelR = outerRadius * 0.6;
  const labelX = centerX + labelR * Math.cos(-midAngle);
  const labelY = centerY + labelR * Math.sin(-midAngle);

  return (
    // outerRadius is NEVER changed   hit detection stays perfectly aligned.
    // CSS scale on this <g> drives the visual expansion with a smooth transition.
    <g
      style={{
        transform: isActive ? `scale(${ACTIVE_SCALE})` : 'scale(1)',
        // Pin the scale origin to the pie center so slices expand radially outward
        transformOrigin: `${centerX}px ${centerY}px`,
        opacity: isDimmed ? 0.35 : 1,
        transition: 'transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.2s ease',
      }}
    >
      <defs>
        <mask id={maskId}>
          <Sector
            cx={centerX} cy={centerY}
            innerRadius={0} outerRadius={outerRadius + 20}
            startAngle={startAngle} endAngle={endAngle}
            fill="#ffffff"
          />
          <Sector
            cx={centerX} cy={centerY}
            innerRadius={0} outerRadius={outerRadius + 20}
            startAngle={startAngle} endAngle={endAngle}
            fill="none" stroke="#000000" strokeWidth={GAP_WIDTH} strokeLinejoin="round"
          />
        </mask>
      </defs>

      {/* Glow ring   fades in when active */}
      <Sector
        cx={centerX} cy={centerY}
        innerRadius={outerRadius + 2}
        outerRadius={outerRadius + 12}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        style={{
          opacity: isActive ? 0.18 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Main sector   geometry never changes, CSS scale drives the visual expansion */}
      <Sector
        cx={centerX} cy={centerY}
        innerRadius={0}
        outerRadius={outerRadius}
        startAngle={startAngle} endAngle={endAngle}
        fill={fill}
        mask={`url(#${maskId})`}
      />

      {percent > 0.03 && (
        <text
          x={labelX} y={labelY}
          textAnchor="middle" dominantBaseline="central"
          fill={isActive ? '#fff' : 'rgba(255,255,255,0.85)'}
          fontSize={isActive ? '12px' : '11px'}
          fontWeight={isActive ? 700 : 600}
          style={{
            pointerEvents: 'none',
            textShadow: isActive ? '0 1px 4px rgba(0,0,0,0.6)' : '0 1px 3px rgba(0,0,0,0.5)',
            transition: 'font-size 0.2s ease',
          }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )}
    </g>
  );
};

export function PieChartComponent({ data, dataKey, nameKey, height = 300, light = false }: PieChartProps) {
  const chartId = useId();

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const activeIndexRef = useRef<number | undefined>(undefined);

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
    activeIndexRef.current = undefined;
    setActiveIndex(undefined);
  }, [drilldown, data, nameKey, subCache]);

  const handleMouseEnter = useCallback((_: any, index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    activeIndexRef.current = undefined;
    setActiveIndex(undefined);
  }, []);

  const handleBack = useCallback(() => {
    setDrilldown(null);
    activeIndexRef.current = undefined;
    setActiveIndex(undefined);
  }, []);

  const shapeRenderer = useCallback(
    (props: any) => renderCustomShape({ ...props, activeIndexRef, chartId }),
    [chartId],
  );

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
              {drilldown.label}   Breakdown
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
            {/* onMouseLeave on PieChart catches exits that the Pie-level handler misses  
                e.g. fast mouse movement off the edge, or crossing slice borders briefly */}
            <PieChart onMouseLeave={handleMouseLeave}>
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
                shape={shapeRenderer}
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
                  <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
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