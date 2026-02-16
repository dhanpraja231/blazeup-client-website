'use client';

import React, { useState } from 'react';

interface WeeklyData {
  week: number;
  value: number;
}

interface YearData {
  year: number;
  weeks: WeeklyData[];
}

export interface SpendingHeatmapProps {
  data: YearData[];
  title?: string;
  subtitle?: string;
  light?: boolean;
}

interface TooltipData {
  year: number;
  week: number;
  value: number;
  x: number;
  y: number;
}

const TOTAL_WEEKS = 52;

export function SpendingHeatmap({
  data,
  title = 'Company Spending Heatmap',
  subtitle = 'Weekly expenditure intensity',
  light = false,
}: SpendingHeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const monthMarkers = [
    { label: 'Jan', week: 1 },
    { label: 'Feb', week: 5 },
    { label: 'Mar', week: 9 },
    { label: 'Apr', week: 14 },
    { label: 'May', week: 18 },
    { label: 'Jun', week: 22 },
    { label: 'Jul', week: 27 },
    { label: 'Aug', week: 31 },
    { label: 'Sep', week: 35 },
    { label: 'Oct', week: 40 },
    { label: 'Nov', week: 44 },
    { label: 'Dec', week: 48 },
  ];

  const getColor = (value: number): string => {
    if (value === 0) return light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
    const hue = 130 + value * 0.1;
    const saturation = 40 + value * 0.5;
    const lightness = 85 - value * 0.65;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getWeekValue = (yearData: YearData, weekIndex: number): number => {
    const weekData = yearData.weeks.find((w) => w.week === weekIndex + 1);
    return weekData?.value ?? 0;
  };

  const handleMouseEnter = (
    e: React.MouseEvent,
    year: number,
    weekIndex: number,
    value: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      year,
      week: weekIndex + 1,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 relative"
      style={{
        background: light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {/* Inline hover styles */}
      <style>{`
        .heatmap-cell {
          transition: transform 0.1s ease;
          position: relative;
        }
        .heatmap-cell:hover {
          transform: scale(1.4);
          outline: 1.5px solid ${light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'};
          z-index: 5;
          border-radius: 2px;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-semibold" style={{ color: light ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.8)' }}>{title}</h3>
        <p className="text-xs mt-1" style={{ color: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)' }}>{subtitle}</p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        {/* Month labels row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `50px repeat(${TOTAL_WEEKS}, 1fr)`,
            gap: '2px',
            marginBottom: '4px',
            minWidth: 600,
          }}
        >
          <div />
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
            const marker = monthMarkers.find((m) => m.week === i + 1);
            return (
              <div
                key={`wk-label-${i}`}
                className="text-[8px] text-center font-medium"
                style={{ color: light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}
              >
                {marker ? marker.label : ''}
              </div>
            );
          })}
        </div>

        {/* Year rows */}
        {data.map((yearData) => (
          <div
            key={yearData.year}
            style={{
              display: 'grid',
              gridTemplateColumns: `50px repeat(${TOTAL_WEEKS}, 1fr)`,
              gap: '2px',
              marginBottom: '2px',
              minWidth: 600,
            }}
          >
            <div
              className="text-[11px] text-right pr-3 font-medium"
              style={{ lineHeight: '14px', color: light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)' }}
            >
              {yearData.year}
            </div>

            {Array.from({ length: TOTAL_WEEKS }, (_, weekIndex) => {
              const value = getWeekValue(yearData, weekIndex);
              return (
                <div
                  key={`${yearData.year}-w${weekIndex}`}
                  className="heatmap-cell"
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: getColor(value),
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    handleMouseEnter(e, yearData.year, weekIndex, value)
                  }
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-5 text-[11px]" style={{ color: light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.35)' }}>
        <span>Low Expenditure</span>
        <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(130, 60%, 85%)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(133, 65%, 65%)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(135, 70%, 50%)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(138, 80%, 35%)' }} />
        <div className="w-3 h-3 rounded-sm" style={{ background: 'hsl(140, 90%, 20%)' }} />
        <span>High Expenditure</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: light ? '#fff' : '#1a1a2e',
            border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '8px',
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: light ? '0 8px 24px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.6)',
            minWidth: '110px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: light ? '#1e293b' : '#fff', marginBottom: '2px' }}>
            {tooltip.year}
          </div>
          <div style={{ fontSize: '11px', color: light ? '#64748b' : 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            Week {tooltip.week}
          </div>
          <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 500 }}>
            Intensity: {tooltip.value}%
          </div>
        </div>
      )}
    </div>
  );
}
