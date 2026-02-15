export function getChartTheme(light: boolean) {
  return {
    colors: {
      primary: '#16a34a',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      text: light ? '#475569' : '#94a3b8',
      grid: light ? '#e2e8f0' : '#334155',
      background: light ? '#ffffff' : '#09090b',
    },
    axisStyle: {
      fontSize: 12,
      fill: light ? '#64748b' : '#64748b',
      fontWeight: 500 as const,
    },
  };
}

/** Backwards-compatible default (dark) */
export const CHART_THEME = getChartTheme(false);

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
