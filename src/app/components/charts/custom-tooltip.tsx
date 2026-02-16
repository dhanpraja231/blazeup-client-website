'use client';
import React from 'react';
import { formatCurrency } from './chart-config';

export const CustomTooltip = ({ active, payload, label, light }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border p-3 backdrop-blur-md shadow-xl z-50"
        style={{
          background: light ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
          borderColor: light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        }}>
        <p className="mb-1 text-xs font-medium" style={{ color: light ? '#64748b' : '#94a3b8' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-bold" style={{ color: light ? '#1e293b' : '#fff' }}>
              {entry.name}: {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
