'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DailyData {
  day: number;
  value: number;
}

interface YearData {
  year: number;
  days: DailyData[];
}

export interface SpendingHeatmapProps {
  data: YearData[];
  title?: string;
  subtitle?: string;
  light?: boolean;
}

interface TooltipData {
  year: number;
  day: number;
  value: number;
  x: number;
  y: number;
  date: string;
}

const WEEKS_IN_YEAR = 53;
const DAYS_IN_WEEK = 7;

export function SpendingHeatmap({
  data,
  title = 'Company Spending Heatmap',
  subtitle = 'Daily expenditure intensity',
  light = false,
}: SpendingHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const currentYearData = data.find((d) => d.year === selectedYear);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getColor = (value: number): string => {
    if (value === 0) return light ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
    const hue = 130 + value * 0.1;
    const saturation = 40 + value * 0.5;
    const lightness = 85 - value * 0.65;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getDayValue = (dayOfYear: number): number => {
    const dayData = currentYearData?.days.find((d) => d.day === dayOfYear);
    return dayData?.value ?? 0;
  };

  const getDateFromDay = (dayOfYear: number, year: number): Date => {
    const date = new Date(year, 0, dayOfYear);
    return date;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get first day of year (0=Sunday, 6=Saturday)
  const firstDayOfYear = new Date(selectedYear, 0, 1).getDay();

  // Calculate which week each month starts in
  const getMonthPositions = () => {
    const positions: { month: string; weekIndex: number }[] = [];
    for (let month = 0; month < 12; month++) {
      const firstDayOfMonth = new Date(selectedYear, month, 1);
      const dayOfYear = Math.floor((firstDayOfMonth.getTime() - new Date(selectedYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const weekIndex = Math.floor((dayOfYear + firstDayOfYear - 1) / 7);
      positions.push({
        month: monthLabels[month],
        weekIndex: weekIndex,
      });
    }
    return positions;
  };

  const monthPositions = getMonthPositions();

  const handleMouseEnter = (
    e: React.MouseEvent,
    dayOfYear: number,
    value: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const date = getDateFromDay(dayOfYear, selectedYear);
    setTooltip({
      year: selectedYear,
      day: dayOfYear,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      date: formatDate(date),
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div
      className="rounded-xl p-6 sm:p-8 relative"
      style={{
        background: light ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {/* Inline hover styles */}
      <style>{`
        .heatmap-cell {
          transition: transform 0.15s ease, outline 0.15s ease;
          position: relative;
        }
        .heatmap-cell:hover {
          transform: scale(1.3);
          outline: 2px solid ${light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)'};
          z-index: 10;
          border-radius: 2px;
        }
      `}</style>

      {/* Header with Year Filter */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold" style={{ color: light ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.8)' }}>{title}</h3>
          <p className="text-xs mt-1" style={{ color: light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)' }}>{subtitle}</p>
        </div>

        {/* Year Selector */}
        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: light ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
              color: light ? '#1e293b' : 'rgba(255,255,255,0.8)',
            }}
          >
            <span>{selectedYear}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showYearDropdown && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{
                background: light ? '#fff' : '#1a1a2e',
                border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                minWidth: '120px',
              }}
            >
              {data.map((yearData) => (
                <button
                  key={yearData.year}
                  onClick={() => {
                    setSelectedYear(yearData.year);
                    setShowYearDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                  style={{
                    color: yearData.year === selectedYear ? '#6366f1' : (light ? '#475569' : 'rgba(255,255,255,0.7)'),
                    background: yearData.year === selectedYear ? 'rgba(99,102,241,0.1)' : 'transparent',
                  }}
                >
                  {yearData.year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap Grid - Calendar Style (53 weeks × 7 days) */}
      <div className="w-full pb-2">
        <div className="grid gap-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
          {/* Day of week labels */}
          <div className="grid gap-[2px]" style={{ gridTemplateRows: `20px repeat(${DAYS_IN_WEEK}, 1fr)`, paddingTop: '0' }}>
            <div></div>
            {dayLabels.map((day) => (
              <div
                key={day}
                className="text-[9px] font-medium text-right flex items-center justify-end pr-2"
                style={{
                  color: light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid container - fills remaining width */}
          <div className="min-w-0">
            {/* Month labels positioned above their actual weeks */}
            <div className="h-5 mb-1">
              <div className="grid w-full gap-[2px]" style={{ gridTemplateColumns: `repeat(${WEEKS_IN_YEAR}, 1fr)` }}>
                {Array.from({ length: WEEKS_IN_YEAR }, (_, weekIndex) => {
                  const monthAtWeek = monthPositions.find((m) => m.weekIndex === weekIndex);
                  return (
                    <div
                      key={`month-label-${weekIndex}`}
                      className="text-[9px] font-medium"
                      style={{
                        color: light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {monthAtWeek?.month || ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid of days organized by weeks using CSS Grid */}
            <div
              className="grid w-full gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${WEEKS_IN_YEAR}, 1fr)`,
                gridTemplateRows: `repeat(${DAYS_IN_WEEK}, 1fr)`,
              }}
            >
              {Array.from({ length: WEEKS_IN_YEAR * DAYS_IN_WEEK }, (_, index) => {
                const weekIndex = Math.floor(index / DAYS_IN_WEEK);
                const dayOfWeek = index % DAYS_IN_WEEK;
                const dayOfYear = weekIndex * 7 + dayOfWeek - firstDayOfYear + 1;
                const isValidDay = dayOfYear >= 1 && dayOfYear <= (currentYearData?.days.length || 365);
                const value = isValidDay ? getDayValue(dayOfYear) : -1;

                return (
                  <div
                    key={`cell-${index}`}
                    className={isValidDay ? 'heatmap-cell' : ''}
                    style={{
                      aspectRatio: '1',
                      backgroundColor: isValidDay ? getColor(value) : 'transparent',
                      borderRadius: '2px',
                      cursor: isValidDay ? 'pointer' : 'default',
                      gridColumn: weekIndex + 1,
                      gridRow: dayOfWeek + 1,
                    }}
                    onMouseEnter={isValidDay ? (e) => handleMouseEnter(e, dayOfYear, value) : undefined}
                    onMouseLeave={isValidDay ? handleMouseLeave : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
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
            minWidth: '140px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: light ? '#1e293b' : '#fff', marginBottom: '4px' }}>
            {tooltip.date}
          </div>
          <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: 500 }}>
            {tooltip.value === 0 ? 'No spending' : `Intensity: ${tooltip.value}%`}
          </div>
        </div>
      )}
    </div>
  );
}
