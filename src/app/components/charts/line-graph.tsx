'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_THEME } from './chart-config';
import { CustomTooltip } from './custom-tooltip';

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
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_THEME.colors.grid} opacity={0.2} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={CHART_THEME.axisStyle} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={CHART_THEME.axisStyle} tickFormatter={(val) => `$${val/1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          {lines.map((line, i) => (
            <Line 
              key={i}
              type="monotone" 
              dataKey={line.key} 
              name={line.name}
              stroke={line.color} 
              strokeWidth={3} 
              dot={{ r: 0 }}       
              activeDot={{ r: 6 }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
