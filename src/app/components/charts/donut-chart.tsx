'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_THEME } from './chart-config';
import { CustomTooltip } from './custom-tooltip';

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

export function DonutChart({ data, dataKey, nameKey, height = 300, light = false }: DonutChartProps) {
  const legendSpace = Math.min(50, Math.max(32, data.length * 10));
  const chartArea = height - legendSpace - 16;
  const outerRadius = Math.max(30, Math.min(80, chartArea * 0.38));
  const innerRadius = Math.max(18, outerRadius * 0.7);
  const paddingAngle = outerRadius < 50 ? 3 : 5;

  return (
    <div style={{ width: '100%', height, overflow: 'hidden' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="45%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey={dataKey}
            nameKey={nameKey}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip light={light} />} />
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
    </div>
  );
}
