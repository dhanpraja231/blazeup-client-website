export const CHART_THEME = {
  colors: {
    primary: '#6366f1',   // Indigo
    secondary: '#8b5cf6', // Violet
    success: '#10b981',   // Emerald
    warning: '#f59e0b',   // Amber
    danger: '#ef4444',    // Red
    text: '#94a3b8',      // Slate-400
    grid: '#334155',      // Slate-700
    background: '#09090b' // Dark
  },
  axisStyle: {
    fontSize: 12,
    fill: '#64748b',
    fontWeight: 500,
  }
};

export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 0 
  }).format(value);
