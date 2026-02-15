'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartTheme } from './chart-config';

interface BarGraphProps {
  data: any[];
  xKey: string;
  dataKey: string;
  color?: string;
  height?: number;
  light?: boolean;
}

export function BarGraph({ data, xKey, dataKey, color, height = 300, light = false }: BarGraphProps) {
  const theme = getChartTheme(light);
  const barColor = color || theme.colors.primary;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.colors.grid} opacity={light ? 0.6 : 0.2} />
          <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={theme.axisStyle} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={theme.axisStyle} tickFormatter={(val) => `$${val/1000}k`} />
          <Tooltip
            cursor={{ fill: light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border p-3 shadow-xl z-50 backdrop-blur-md"
                  style={{
                    background: light ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
                    borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
                  }}>
                  <p className="mb-1 text-xs font-medium" style={{ color: light ? '#64748b' : '#94a3b8' }}>{label}</p>
                  {payload.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm font-bold" style={{ color: light ? '#1e293b' : '#fff' }}>
                        {entry.name}: ${(entry.value / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
