'use client';

import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getChartTheme } from './chart-config';
import { ArrowLeft } from 'lucide-react';

interface BarGraphProps {
  data: any[];
  xKey: string;
  dataKey: string;
  color?: string;
  height?: number;
  light?: boolean;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateMonthlyValues(total: number) {
  return MONTH_LABELS.map((month) => ({
    name: month,
    value: Math.floor(total / 12 + (Math.random() * (total / 40) - total / 80)),
  }));
}

export function BarGraph({ data, xKey, dataKey, color, height = 300, light = false }: BarGraphProps) {
  const theme = getChartTheme(light);
  const barColor = color || theme.colors.primary;

  const [drilldown, setDrilldown] = useState<{ label: string; data: any[] } | null>(null);

  // Memoize monthly data so it doesn't regenerate on every render
  const monthlyCache = useMemo(() => {
    const cache: Record<string, any[]> = {};
    data.forEach((d) => {
      cache[d[xKey]] = generateMonthlyValues(d[dataKey]);
    });
    return cache;
  }, [data, xKey, dataKey]);

  const activeData = drilldown ? drilldown.data : data;
  const activeXKey = drilldown ? 'name' : xKey;
  const activeDataKey = drilldown ? 'value' : dataKey;

  const handleBarClick = (entry: any) => {
    if (drilldown) return; // already drilled down
    const label = entry[xKey];
    setDrilldown({ label, data: monthlyCache[label] });
  };

  return (
    <div style={{ width: '100%', height: height + 28 }}>
      {/* Drilldown header */}
      {drilldown && (
        <div className="flex items-center justify-between mb-1 px-1">
          <span
            className="text-[11px] font-semibold"
            style={{ color: light ? '#475569' : 'rgba(255,255,255,0.5)' }}
          >
            {drilldown.label} — Monthly Breakdown
          </span>
          <button
            onClick={() => setDrilldown(null)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all"
            style={{
              background: light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
              color: light ? '#475569' : 'rgba(255,255,255,0.6)',
              border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={activeData}
          margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
          style={{ cursor: drilldown ? 'default' : 'pointer' }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={theme.colors.grid}
            opacity={light ? 0.6 : 0.2}
          />
          <XAxis
            dataKey={activeXKey}
            axisLine={false}
            tickLine={false}
            tick={theme.axisStyle}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={theme.axisStyle}
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div
                  className="rounded-xl border p-3 shadow-xl z-50 backdrop-blur-md"
                  style={{
                    background: light ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
                    borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <p
                    className="mb-1 text-xs font-medium"
                    style={{ color: light ? '#64748b' : '#94a3b8' }}
                  >
                    {label}
                  </p>
                  {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span
                        className="text-sm font-bold"
                        style={{ color: light ? '#1e293b' : '#fff' }}
                      >
                        ${(entry.value / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                  {!drilldown && (
                    <p
                      className="mt-1.5 text-[10px] italic"
                      style={{ color: light ? '#94a3b8' : 'rgba(255,255,255,0.3)' }}
                    >
                      Click to drill down
                    </p>
                  )}
                </div>
              );
            }}
          />
          <Bar
            dataKey={activeDataKey}
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
            onClick={handleBarClick}
          >
            {activeData.map((_: any, i: number) => (
              <Cell key={i} fill={barColor} cursor={drilldown ? 'default' : 'pointer'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
