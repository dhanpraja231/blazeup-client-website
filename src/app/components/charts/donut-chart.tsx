'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_THEME } from './chart-config';
import { CustomTooltip } from './custom-tooltip';

interface DonutChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
}

const COLORS = [
  CHART_THEME.colors.primary, 
  CHART_THEME.colors.secondary, 
  CHART_THEME.colors.success, 
  CHART_THEME.colors.warning,
  CHART_THEME.colors.danger
];

export function DonutChart({ data, dataKey, nameKey, height = 300 }: DonutChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={60} 
            outerRadius={80}
            paddingAngle={5}
            dataKey={dataKey} 
            nameKey={nameKey}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
