'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getChartTheme } from './chart-config';

interface ScatterGraphProps {
  data: { name: string; x: number; y: number }[];
  color?: string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  light?: boolean;
}

export function ScatterGraph({
  data,
  color,
  height = 300,
  xLabel = 'Spend ($k)',
  yLabel = 'Tenure (yrs)',
  light = false,
}: ScatterGraphProps) {
  const theme = getChartTheme(light);
  const dotColor = color || theme.colors.primary;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme.colors.grid}
            opacity={light ? 0.6 : 0.2}
          />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            axisLine={false}
            tickLine={false}
            tick={theme.axisStyle}
            label={{
              value: xLabel,
              position: 'insideBottom',
              offset: -2,
              style: { fill: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)', fontSize: 10 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            axisLine={false}
            tickLine={false}
            tick={theme.axisStyle}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fill: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)', fontSize: 10 },
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { name: string; x: number; y: number };
              return (
                <div className="rounded-xl border p-3 shadow-xl z-50 backdrop-blur-md"
                  style={{
                    background: light ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
                    borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                  }}>
                  <p className="text-sm font-bold mb-1" style={{ color: light ? '#1e293b' : '#fff' }}>{d.name}</p>
                  <p className="text-xs" style={{ color: light ? '#64748b' : 'rgba(255,255,255,0.5)' }}>
                    Spend: ${d.x}k · Tenure: {d.y}yrs
                  </p>
                </div>
              );
            }}
          />
          <Scatter data={data} fill={dotColor}>
            {data.map((_, i) => (
              <Cell key={i} fill={dotColor} fillOpacity={0.7} stroke={dotColor} strokeWidth={1} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
