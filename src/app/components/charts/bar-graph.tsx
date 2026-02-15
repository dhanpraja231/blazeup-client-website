'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_THEME } from './chart-config';
import { CustomTooltip } from './custom-tooltip';

interface BarGraphProps {
  data: any[];
  xKey: string;
  dataKey: string;
  color?: string;
  height?: number;
}

export function BarGraph({ data, xKey, dataKey, color = CHART_THEME.colors.primary, height = 300 }: BarGraphProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_THEME.colors.grid} opacity={0.2} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={CHART_THEME.axisStyle} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={CHART_THEME.axisStyle} tickFormatter={(val) => `$${val/1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
