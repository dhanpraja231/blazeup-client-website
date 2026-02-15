'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CHART_THEME } from './chart-config';

interface LineConfig {
  key: string;
  name: string;
  color: string;
}

interface LineGraphProps {
  data: any[];
  xKey: string;
  lines: LineConfig[];
  height?: number;
}

export function LineGraph({ data, xKey, lines, height = 300 }: LineGraphProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
          <defs>
            {lines.map((line) => (
              <linearGradient
                key={`grad-${line.key}`}
                id={`gradient-${line.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={line.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={line.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={CHART_THEME.colors.grid}
            opacity={0.2}
          />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={CHART_THEME.axisStyle}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={CHART_THEME.axisStyle}
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-white/10 bg-black/90 p-3 backdrop-blur-md shadow-xl z-50">
                  <p className="mb-1.5 text-xs font-semibold" style={{ color: payload[0]?.color || '#2ecc71' }}>
                    {label}
                  </p>
                  {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-bold text-white">
                        {entry.name}: ${(entry.value / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {lines.length > 1 && (
            <Legend verticalAlign="top" height={36} iconType="circle" />
          )}
          {lines.map((line) => (
            <Area
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={3}
              fill={`url(#gradient-${line.key})`}
              dot={false}
              activeDot={{
                r: 7,
                stroke: '#fff',
                strokeWidth: 3,
                fill: line.color,
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
