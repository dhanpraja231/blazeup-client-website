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
import { CHART_THEME } from './chart-config';

interface ScatterGraphProps {
  data: { name: string; x: number; y: number }[];
  color?: string;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

export function ScatterGraph({
  data,
  color = CHART_THEME.colors.primary,
  height = 300,
  xLabel = 'Spend ($k)',
  yLabel = 'Tenure (yrs)',
}: ScatterGraphProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.colors.grid}
            opacity={0.2}
          />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            axisLine={false}
            tickLine={false}
            tick={CHART_THEME.axisStyle}
            label={{
              value: xLabel,
              position: 'insideBottom',
              offset: -2,
              style: { fill: 'rgba(255,255,255,0.3)', fontSize: 10 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            axisLine={false}
            tickLine={false}
            tick={CHART_THEME.axisStyle}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fill: 'rgba(255,255,255,0.3)', fontSize: 10 },
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as {
                name: string;
                x: number;
                y: number;
              };
              return (
                <div className="rounded-xl border border-white/10 bg-black/90 p-3 backdrop-blur-md shadow-xl z-50">
                  <p className="text-sm font-bold text-white mb-1">{d.name}</p>
                  <p className="text-xs text-white/50">
                    Spend: ${d.x}k · Tenure: {d.y}yrs
                  </p>
                </div>
              );
            }}
          />
          <Scatter data={data} fill={color}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={color}
                fillOpacity={0.7}
                stroke={color}
                strokeWidth={1}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
