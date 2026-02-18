'use client';

import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ThemeCtx = createContext(false);
function useLight() { return useContext(ThemeCtx); }
import {
  Layers,
  Building2,
  User,
  Clock,
  GripVertical,
  ChevronDown,
  Eye,
  Pencil,
  Send,
  Check,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileWarning,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Grid3X3,
  ScatterChart,
  AreaChart as AreaChartIcon,
  CircleDot,
  Store,
  Sun,
  Moon,
} from 'lucide-react';

/* ── Dynamic imports for recharts components (no SSR) ── */
const BarGraph = dynamic(() => import('@/components/charts/bar-graph').then(m => ({ default: m.BarGraph })), { ssr: false, loading: () => <ChartSkeleton /> });
const LineGraph = dynamic(() => import('@/components/charts/line-graph').then(m => ({ default: m.LineGraph })), { ssr: false, loading: () => <ChartSkeleton /> });
const DonutChart = dynamic(() => import('@/components/charts/donut-chart').then(m => ({ default: m.DonutChart })), { ssr: false, loading: () => <ChartSkeleton /> });
const ScatterGraph = dynamic(() => import('@/components/charts/scatter-graph').then(m => ({ default: m.ScatterGraph })), { ssr: false, loading: () => <ChartSkeleton /> });
const SpendingHeatmap = dynamic(() => import('@/components/charts/spending-heatmap').then(m => ({ default: m.SpendingHeatmap })), { ssr: false, loading: () => <ChartSkeleton /> });

function ChartSkeleton() {
  return (
    <div className="w-full h-full min-h-[120px] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white/10 border-t-indigo-500/50 rounded-full animate-spin" />
    </div>
  );
}

/* ═══════════════ TYPES ═══════════════ */
type DashboardMode = 'edit' | 'preview';

interface PlacedWidget {
  kpiId: string;
  chartType: string;
}

/* ═══════════════ KPI DIMENSIONS ═══════════════ */
const KPI_DIMENSIONS = [
  { id: 'category', label: 'Category', icon: <Layers className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-600/20', accent: '#3b82f6' },
  { id: 'department', label: 'Department', icon: <Building2 className="w-5 h-5" />, color: 'from-emerald-500/20 to-emerald-600/20', accent: '#10b981' },
  { id: 'user', label: 'User', icon: <User className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-600/20', accent: '#8b5cf6' },
  { id: 'time', label: 'Time', icon: <Clock className="w-5 h-5" />, color: 'from-orange-500/20 to-orange-600/20', accent: '#f97316' },
  { id: 'merchant', label: 'Merchant', icon: <Store className="w-5 h-5" />, color: 'from-rose-500/20 to-rose-600/20', accent: '#f43f5e' },
];

const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'line', label: 'Line Chart', icon: <LineChartIcon className="w-4 h-4" /> },
  { id: 'doughnut', label: 'Doughnut', icon: <CircleDot className="w-4 h-4" /> },
  { id: 'pie', label: 'Pie Chart', icon: <PieChartIcon className="w-4 h-4" /> },
  { id: 'scatter', label: 'Scatter Plot', icon: <ScatterChart className="w-4 h-4" /> },
];

const KPI_ALLOWED_CHARTS: Record<string, string[]> = {
  category: ['pie', 'doughnut', 'bar'],
  department: ['pie', 'doughnut', 'bar'],
  user: ['bar', 'line'],
  time: ['line', 'scatter'],
  merchant: ['bar', 'doughnut', 'scatter'],
};

/* ═══════════════ MOCK DATA PER KPI ═══════════════ */
const CATEGORY_DATA = [
  { name: 'Travel', value: 24500 },
  { name: 'Software', value: 18200 },
  { name: 'Hardware', value: 12800 },
  { name: 'Office', value: 9400 },
  { name: 'Food', value: 6700 },
];

const DEPARTMENT_DATA = [
  { name: 'Engineering', value: 42000 },
  { name: 'Marketing', value: 31000 },
  { name: 'Sales', value: 28500 },
  { name: 'Operations', value: 19000 },
  { name: 'HR', value: 8500 },
];

const USER_DATA = [
  { name: 'Arjun M.', value: 4520 },
  { name: 'Priya S.', value: 8780 },
  { name: 'Rahul V.', value: 12340 },
  { name: 'Sneha P.', value: 3210 },
  { name: 'Vikram S.', value: 6890 },
];

const TIME_DATA = [
  { name: 'Jan', value: 18000, budget: 20000 },
  { name: 'Feb', value: 22000, budget: 20000 },
  { name: 'Mar', value: 19500, budget: 21000 },
  { name: 'Apr', value: 25000, budget: 22000 },
  { name: 'May', value: 21000, budget: 22000 },
  { name: 'Jun', value: 28000, budget: 23000 },
  { name: 'Jul', value: 24000, budget: 23000 },
  { name: 'Aug', value: 26500, budget: 24000 },
];

const MERCHANT_DATA = [
  { name: 'Amazon', value: 18500 },
  { name: 'Uber', value: 9200 },
  { name: 'Airbnb', value: 14700 },
  { name: 'WeWork', value: 11300 },
  { name: 'Starbucks', value: 4800 },
  { name: 'Adobe', value: 7600 },
];

const SCATTER_DATA: Record<string, { name: string; x: number; y: number }[]> = {
  time: [
    { name: 'Arjun M.', x: 4.5, y: 2.1 },
    { name: 'Priya S.', x: 8.8, y: 5.3 },
    { name: 'Rahul V.', x: 12.3, y: 7.8 },
    { name: 'Sneha P.', x: 3.2, y: 1.5 },
    { name: 'Vikram S.', x: 6.9, y: 4.2 },
    { name: 'Anita K.', x: 9.5, y: 6.0 },
    { name: 'Ravi D.', x: 5.1, y: 3.4 },
    { name: 'Diya R.', x: 11.2, y: 8.1 },
    { name: 'Karan J.', x: 7.4, y: 3.9 },
    { name: 'Meera T.', x: 15.0, y: 9.5 },
  ],
  merchant: [
    { name: 'Amazon', x: 18.5, y: 42 },
    { name: 'Uber', x: 9.2, y: 85 },
    { name: 'Airbnb', x: 14.7, y: 24 },
    { name: 'WeWork', x: 11.3, y: 12 },
    { name: 'Starbucks', x: 4.8, y: 120 },
    { name: 'Adobe', x: 7.6, y: 6 },
    { name: 'Microsoft', x: 22.0, y: 15 },
    { name: 'Zomato', x: 3.5, y: 90 },
  ],
};

function getDataForKPI(kpiId: string) {
  switch (kpiId) {
    case 'category': return CATEGORY_DATA;
    case 'department': return DEPARTMENT_DATA;
    case 'user': return USER_DATA;
    case 'time': return TIME_DATA;
    case 'merchant': return MERCHANT_DATA;
    default: return CATEGORY_DATA;
  }
}

/* ═══════════════ DROP ZONES ═══════════════ */
interface DropZoneConfig {
  id: string;
  label: string;
  colSpan: string;
  rowSpan: string;
}

const DROP_ZONES: DropZoneConfig[] = [
  { id: 'zone-1', label: 'Primary View', colSpan: 'col-span-1 lg:col-span-2', rowSpan: 'row-span-1 lg:row-span-2' },
  { id: 'zone-2', label: 'Secondary View', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { id: 'zone-3', label: 'Breakdown View', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
  { id: 'zone-4', label: 'Comparison View', colSpan: 'col-span-1 lg:col-span-2', rowSpan: 'row-span-1' },
  { id: 'zone-5', label: 'Detail View', colSpan: 'col-span-1', rowSpan: 'row-span-1' },
];

/* ═══════════════ ALERTS ═══════════════ */
const ALERTS = [
  { id: 'fraud', label: 'Potential Fraud', value: 12, trend: '+3', trendUp: true, icon: <ShieldAlert className="w-5 h-5" />, accentColor: '#ef4444', ringColor: 'rgba(239,68,68,0.15)', ringColor2: 'rgba(239,68,68,0.08)' },
  { id: 'approval', label: 'Needs Approval', value: 28, trend: '-5', trendUp: false, icon: <FileWarning className="w-5 h-5" />, accentColor: '#f97316', ringColor: 'rgba(249,115,22,0.15)', ringColor2: 'rgba(249,115,22,0.08)' },
  { id: 'anomaly', label: 'Anomalies', value: 7, trend: '+2', trendUp: true, icon: <AlertTriangle className="w-5 h-5" />, accentColor: '#eab308', ringColor: 'rgba(234,179,8,0.15)', ringColor2: 'rgba(234,179,8,0.08)' },
  { id: 'resolved', label: 'Resolved Today', value: 45, trend: '+12', trendUp: true, icon: <CheckCircle2 className="w-5 h-5" />, accentColor: '#22c55e', ringColor: 'rgba(34,197,94,0.15)', ringColor2: 'rgba(34,197,94,0.08)' },
];

/* ═══════════════ EMPLOYEES ═══════════════ */
const EMPLOYEES = [
  { id: 1, name: 'Arjun Mehta', dept: 'Engineering', role: 'Senior Developer', spend: 4520, transactions: 34, status: 'Active', avatar: 'AM' },
  { id: 2, name: 'Priya Sharma', dept: 'Marketing', role: 'Campaign Manager', spend: 8780, transactions: 52, status: 'Active', avatar: 'PS' },
  { id: 3, name: 'Rahul Verma', dept: 'Sales', role: 'Account Executive', spend: 12340, transactions: 67, status: 'Review', avatar: 'RV' },
  { id: 4, name: 'Sneha Patel', dept: 'Finance', role: 'Financial Analyst', spend: 3210, transactions: 21, status: 'Active', avatar: 'SP' },
  { id: 5, name: 'Vikram Singh', dept: 'Operations', role: 'Operations Lead', spend: 6890, transactions: 45, status: 'Active', avatar: 'VS' },
  { id: 6, name: 'Ananya Iyer', dept: 'Engineering', role: 'Tech Lead', spend: 5670, transactions: 38, status: 'Flagged', avatar: 'AI' },
  { id: 7, name: 'Karthik Reddy', dept: 'Marketing', role: 'Designer', spend: 2340, transactions: 18, status: 'Active', avatar: 'KR' },
  { id: 8, name: 'Meera Nair', dept: 'HR', role: 'HR Manager', spend: 1890, transactions: 15, status: 'Active', avatar: 'MN' },
  { id: 9, name: 'Rohan Gupta', dept: 'Sales', role: 'Sales Director', spend: 15670, transactions: 89, status: 'Review', avatar: 'RG' },
  { id: 10, name: 'Divya Joshi', dept: 'Finance', role: 'Controller', spend: 2100, transactions: 12, status: 'Active', avatar: 'DJ' },
];

const EMPLOYEE_CATEGORIES = [
  { name: 'Travel', value: 2100 },
  { name: 'Software', value: 1200 },
  { name: 'Hardware', value: 800 },
  { name: 'Food', value: 420 },
];

/* ═══════════════ HEATMAP DATA (Daily) ═══════════════ */
function generateDailyData(year: number, baseLine: number, variance: number, emptyDays: number[] = []) {
  const days = [];
  const daysInYear = year % 4 === 0 ? 366 : 365; // Account for leap years

  for (let d = 1; d <= daysInYear; d++) {
    // Check if this day should be empty (no spending)
    if (emptyDays.includes(d)) {
      days.push({ day: d, value: 0 });
      continue;
    }

    // Random chance of zero spending (30% chance for any day - weekends, holidays, etc.)
    if (Math.random() > 0.7) {
      days.push({ day: d, value: 0 });
      continue;
    }

    // Highly sporadic pattern with random spikes and drops
    const randomSpike = Math.random() > 0.85 ? Math.random() * 50 : 0; // 15% chance of large spike
    const randomDrop = Math.random() > 0.9 ? -Math.random() * 30 : 0; // 10% chance of significant drop
    const highVariance = (Math.random() - 0.5) * variance * 2; // Double the variance for sporadic behavior

    // Occasional extreme outliers
    const extremeOutlier = Math.random() > 0.95 ? (Math.random() > 0.5 ? 40 : -20) : 0;

    // Random quiet periods (very low activity)
    const quietPeriod = Math.random() > 0.92 ? -baseLine * 0.6 : 0;

    // Calculate highly sporadic value
    const rawValue = baseLine + highVariance + randomSpike + randomDrop + extremeOutlier + quietPeriod;
    const value = Math.max(0, Math.min(100, Math.round(rawValue)));

    days.push({ day: d, value });
  }
  return days;
}

// Generate some empty day ranges (holidays, company shutdowns, etc.)
const empty2023 = [1, 2, 3, 15, 50, 51, 52, 99, 100, 150, 151, 180, 181, 250, 270, 300, 350, 364, 365];
const empty2024 = [1, 2, 3, 20, 60, 61, 62, 110, 111, 160, 161, 190, 191, 260, 280, 310, 355, 365, 366];
const empty2025 = [1, 2, 3, 25, 70, 71, 72, 120, 121, 170, 171, 200, 201, 270, 290, 320, 360, 364, 365];
const empty2026 = [1, 2, 3, 10, 20, 30, 40];

const HEATMAP_DATA = [
  { year: 2023, days: generateDailyData(2023, 45, 35, empty2023) },
  { year: 2024, days: generateDailyData(2024, 50, 40, empty2024) },
  { year: 2025, days: generateDailyData(2025, 48, 38, empty2025) },
  { year: 2026, days: generateDailyData(2026, 52, 42, empty2026).filter(d => d.day <= 48) }, // Current day of year (Feb 17)
];

const EMPLOYEE_TIME_DATA = [
  { name: 'Jan', spending: 320 },
  { name: 'Feb', spending: 480 },
  { name: 'Mar', spending: 390 },
  { name: 'Apr', spending: 710 },
  { name: 'May', spending: 560 },
  { name: 'Jun', spending: 820 },
  { name: 'Jul', spending: 640 },
  { name: 'Aug', spending: 600 },
];

/* ═══════════════ REAL CHART RENDERER ═══════════════ */
const RealChart = React.memo(function RealChart({ chartType, kpiId, height }: { chartType: string; kpiId: string; height?: number }) {
  const light = useLight();
  const data = getDataForKPI(kpiId);
  const kpi = KPI_DIMENSIONS.find(k => k.id === kpiId);
  const h = height || 220;

  if (chartType === 'bar') {
    return <BarGraph data={data} xKey="name" dataKey="value" color={kpi?.accent} height={h} light={light} />;
  }
  if (chartType === 'line') {
    const lines = kpiId === 'time'
      ? [{ key: 'value', name: 'Spending', color: kpi?.accent || '#6366f1' }, { key: 'budget', name: 'Budget', color: '#64748b' }]
      : [{ key: 'value', name: kpi?.label || 'Value', color: kpi?.accent || '#6366f1' }];
    return <LineGraph data={data} xKey="name" lines={lines} height={h} light={light} />;
  }
  if (chartType === 'doughnut') {
    return <DonutChart data={data} dataKey="value" nameKey="name" height={h} light={light} />;
  }
  if (chartType === 'pie') {
    return <DonutChart data={data} dataKey="value" nameKey="name" height={h} light={light} />;
  }
  if (chartType === 'scatter') {
    const scatterData = SCATTER_DATA[kpiId] || SCATTER_DATA['time'];
    return <ScatterGraph data={scatterData} color={kpi?.accent} height={h} light={light} />;
  }
  return <BarGraph data={data} xKey="name" dataKey="value" color={kpi?.accent} height={h} light={light} />;
});

/* ═══════════════ PALETTE ITEM ═══════════════ */
const PaletteItem = React.memo(function PaletteItem({ widget }: { widget: typeof KPI_DIMENSIONS[number] }) {
  const L = useLight();
  return (
    <motion.div
      draggable
      onDragStart={(e) => {
        (e as unknown as React.DragEvent).dataTransfer?.setData('text/kpi-dimension', widget.id);
      }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing select-none transition-colors duration-200 bg-gradient-to-r ${widget.color}`}
      style={{ border: L ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.06)' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: L ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }} />
      <span style={{ color: L ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.5)' }}>{widget.icon}</span>
      <span className="text-xs font-semibold whitespace-nowrap" style={{ color: L ? '#1e293b' : 'rgba(255,255,255,0.8)' }}>{widget.label}</span>
    </motion.div>
  );
});

/* ═══════════════ DASHBOARD ZONE ═══════════════ */
const DashboardZone = React.memo(function DashboardZone({
  zone, widget, mode, onDrop, onRemove, onChartChange,
}: {
  zone: DropZoneConfig;
  widget: PlacedWidget | null;
  mode: DashboardMode;
  onDrop: (zoneId: string, kpiId: string) => void;
  onRemove: (zoneId: string) => void;
  onChartChange: (zoneId: string, chartType: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const L = useLight();
  const kpi = widget ? KPI_DIMENSIONS.find(k => k.id === widget.kpiId) : null;
  const chartMeta = widget ? CHART_TYPES.find(c => c.id === widget.chartType) : null;
  const allowedCharts = widget ? CHART_TYPES.filter(c => (KPI_ALLOWED_CHARTS[widget.kpiId] || []).includes(c.id)) : CHART_TYPES;
  const isPreview = mode === 'preview';
  const isLargeZone = zone.colSpan.includes('col-span-2') || zone.rowSpan.includes('row-span-2');

  return (
    <motion.div
      layout
      className={`${zone.colSpan} ${zone.rowSpan} rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300 ${
        isPreview
          ? ''
          : isDragOver
            ? 'shadow-[0_0_30px_rgba(99,102,241,0.1)]'
            : ''
      }`}
      style={{
        minHeight: isLargeZone && widget ? 360 : 220,
        background: isPreview
          ? (L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.025)')
          : isDragOver
            ? 'rgba(99,102,241,0.04)'
            : widget
              ? (L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.025)')
              : (L ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.015)'),
        border: isPreview
          ? `1px solid ${L ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'}`
          : isDragOver
            ? '2px solid rgba(99,102,241,0.5)'
            : widget
              ? `1px solid ${L ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`
              : `2px dashed ${L ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`,
      }}
      onDragOver={(e) => { if (!isPreview) { e.preventDefault(); setIsDragOver(true); } }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (isPreview) return;
        e.preventDefault();
        setIsDragOver(false);
        const kpiId = e.dataTransfer.getData('text/kpi-dimension');
        if (kpiId) onDrop(zone.id, kpiId);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}` }}>
        <div className="flex items-center gap-2">
          {widget && kpi && <span className="w-2 h-2 rounded-full" style={{ background: kpi.accent }} />}
          <span className="text-[11px] font-medium" style={{ color: widget ? (L ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)') : (L ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)') }}>
            {widget && kpi ? `${kpi.label} · ${chartMeta?.label || 'Bar Chart'}` : zone.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {widget && !isPreview && (
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] transition-all"
                style={{ background: L ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', border: `1px solid ${L ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`, color: L ? '#475569' : 'rgba(255,255,255,0.5)' }}>
                {chartMeta?.icon}
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl shadow-2xl overflow-hidden" style={{ background: L ? '#fff' : '#1a1a2e', border: `1px solid ${L ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}` }}>
                  {allowedCharts.map((ct) => (
                    <button key={ct.id} onClick={() => { onChartChange(zone.id, ct.id); setShowDropdown(false); }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] transition-colors"
                      style={{ color: ct.id === widget.chartType ? '#6366f1' : (L ? '#475569' : 'rgba(255,255,255,0.5)'), background: ct.id === widget.chartType ? 'rgba(99,102,241,0.1)' : 'transparent' }}>
                      {ct.icon} {ct.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {widget && !isPreview && (
            <button onClick={() => onRemove(zone.id)} className="p-1 rounded-md hover:text-red-400 hover:bg-red-500/10 transition-all" style={{ color: L ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }} title="Remove widget">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3">
        {widget && kpi ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: kpi.accent + '18' }}>
                <span className="scale-75" style={{ color: kpi.accent }}>{kpi.icon}</span>
              </div>
              <p className="text-xs font-semibold" style={{ color: L ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)' }}>{kpi.label} Analysis</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <RealChart chartType={widget.chartType} kpiId={widget.kpiId} height={isLargeZone ? 280 : 160} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {isDragOver ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-xs text-indigo-400 font-medium">Release to drop</p>
              </motion.div>
            ) : (
              <>
                <div className="w-10 h-10 mb-2 rounded-lg flex items-center justify-center" style={{ background: L ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)', border: `1px solid ${L ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}` }}>
                  <Layers className="w-4 h-4" style={{ color: L ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)' }} />
                </div>
                <p className="text-[11px]" style={{ color: L ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)' }}>Drag a KPI here</p>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});

/* ═══════════════ ALERT CARD ═══════════════ */
const AlertCard = React.memo(function AlertCard({ alert, index }: { alert: typeof ALERTS[number]; index: number }) {
  const L = useLight();
  return (
    <motion.div
      className="relative flex items-center gap-4 rounded-2xl p-5 overflow-hidden"
      style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'}` }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>

      <div className="relative z-10 shrink-0">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: alert.accentColor + '18', color: alert.accentColor }}>
          {alert.icon}
        </div>
      </div>
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-xs font-medium" style={{ color: L ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>{alert.label}</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold" style={{ color: L ? '#0f172a' : '#fff' }}>{alert.value}</span>
          <span className="flex items-center gap-0.5 text-[11px] font-medium"
            style={{ color: alert.trendUp ? (alert.id === 'resolved' ? '#22c55e' : '#ef4444') : '#22c55e' }}>
            {alert.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {alert.trend}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════ EMPLOYEE LOOKUP ═══════════════ */
function EmployeeLookup() {
  const L = useLight();
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof EMPLOYEES[number] | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return EMPLOYEES;
    const q = search.toLowerCase();
    return EMPLOYEES.filter(e => e.name.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.role.toLowerCase().includes(q));
  }, [search]);

  const statusColor = (s: string) => {
    if (s === 'Active') return { background: 'rgba(34,197,94,0.1)', color: '#22c55e' };
    if (s === 'Review') return { background: 'rgba(249,115,22,0.1)', color: '#f97316' };
    return { background: 'rgba(239,68,68,0.1)', color: '#ef4444' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Table */}
      <div className="lg:col-span-7 rounded-2xl overflow-hidden" style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'}` }}>
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}` }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: L ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }} />
          <input type="text" placeholder="Search employees by name, department, or role..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: L ? '#1e293b' : '#fff' }} />
          {search && <button onClick={() => setSearch('')} className="p-1 rounded-md" style={{ color: L ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: L ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.25)', borderBottom: `1px solid ${L ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)'}` }}>
          <span className="col-span-4">Employee</span>
          <span className="col-span-2">Department</span>
          <span className="col-span-2 text-right">Spend</span>
          <span className="col-span-2 text-right">Txns</span>
          <span className="col-span-2 text-center">Status</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filtered.map((emp) => (
            <motion.button key={emp.id} onClick={() => setSelectedEmployee(emp)}
              className="w-full grid grid-cols-12 gap-2 px-5 py-3 text-left transition-colors duration-150"
              style={{ borderBottom: `1px solid ${L ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)'}`, background: selectedEmployee?.id === emp.id ? 'rgba(22,163,74,0.08)' : 'transparent' }}
              whileTap={{ scale: 0.995 }}>
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff' }}>{emp.avatar}</div>
                <div className="min-w-0"><p className="text-sm font-medium truncate" style={{ color: L ? '#1e293b' : 'rgba(255,255,255,0.8)' }}>{emp.name}</p><p className="text-[10px] truncate" style={{ color: L ? '#94a3b8' : 'rgba(255,255,255,0.3)' }}>{emp.role}</p></div>
              </div>
              <span className="col-span-2 text-xs self-center" style={{ color: L ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>{emp.dept}</span>
              <span className="col-span-2 text-xs font-medium text-right self-center" style={{ color: L ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.6)' }}>₹{emp.spend.toLocaleString()}</span>
              <span className="col-span-2 text-xs text-right self-center" style={{ color: L ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }}>{emp.transactions}</span>
              <div className="col-span-2 flex justify-center self-center">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={statusColor(emp.status)}>{emp.status}</span>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-sm" style={{ color: L ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)' }}>No employees match your search</div>}
        </div>
      </div>

      {/* Detail panel */}
      <div className="lg:col-span-5">
        <AnimatePresence mode="wait">
          {selectedEmployee ? (
            <motion.div key={selectedEmployee.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="rounded-2xl p-6 space-y-5" style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'}` }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff' }}>{selectedEmployee.avatar}</div>
                <div><h4 className="text-lg font-bold" style={{ color: L ? '#0f172a' : '#fff' }}>{selectedEmployee.name}</h4><p className="text-sm" style={{ color: L ? '#64748b' : 'rgba(255,255,255,0.4)' }}>{selectedEmployee.role} · {selectedEmployee.dept}</p></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Total Spend', value: `₹${selectedEmployee.spend.toLocaleString()}` }, { label: 'Transactions', value: selectedEmployee.transactions.toString() }, { label: 'Status', value: selectedEmployee.status }].map((stat) => (
                  <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: L ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)', border: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}` }}>
                    <p className="text-[10px] mb-1" style={{ color: L ? '#94a3b8' : 'rgba(255,255,255,0.3)' }}>{stat.label}</p><p className="text-sm font-semibold" style={{ color: L ? '#1e293b' : 'rgba(255,255,255,0.7)' }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Real Donut Chart — Spending by Category */}
              <div className="rounded-xl p-4" style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}` }}>
                <p className="text-xs font-medium mb-2" style={{ color: L ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>Spending by Category</p>
                <DonutChart data={EMPLOYEE_CATEGORIES} dataKey="value" nameKey="name" height={200} light={L} />
              </div>

              <div className="rounded-xl p-4" style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'}` }}>
                <p className="text-xs font-medium mb-2" style={{ color: L ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>Spending Over Time</p>
                <LineGraph data={EMPLOYEE_TIME_DATA} xKey="name" lines={[{ key: 'spending', name: 'Spending', color: '#16a34a' }]} height={200} light={L} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-12 flex flex-col items-center justify-center text-center"
              style={{ background: L ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)', border: `1px solid ${L ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)'}`, minHeight: 400 }}>
              <User className="w-10 h-10 mb-4" style={{ color: L ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)' }} /><p className="text-sm" style={{ color: L ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)' }}>Select an employee to view details</p>
              <p className="text-[11px] mt-1" style={{ color: L ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)' }}>Click any row in the table</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════ SUBMIT MODAL ═══════════════ */
function SubmitModal({ onClose, widgetCount }: { onClose: () => void; widgetCount: number }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mx-4 rounded-2xl p-8 text-center" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
        {!submitted ? (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Send className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Submit Dashboard</h3>
            <p className="text-sm text-white/40 mb-6">
              Your dashboard has <span className="text-white/70 font-semibold">{widgetCount} widget{widgetCount !== 1 ? 's' : ''}</span> configured.
              This will finalize the layout and ship it to your organization.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/70 transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
              <button onClick={() => setSubmitted(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20">
                Confirm & Submit
              </button>
            </div>
          </>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dashboard Submitted!</h3>
            <p className="text-sm text-white/40 mb-6">Your customized dashboard is being built and will be deployed shortly.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all">Done</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function VisualizeDashboard() {
  const [mode, setMode] = useState<DashboardMode>('edit');
  const [zones, setZones] = useState<Record<string, PlacedWidget>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [light, setLight] = useState(false);
  const L = light;

  const widgetCount = Object.keys(zones).length;

  const handleDrop = useCallback((zoneId: string, kpiId: string) => {
    const defaultChart = (KPI_ALLOWED_CHARTS[kpiId] || ['bar'])[0];
    setZones(prev => ({ ...prev, [zoneId]: { kpiId, chartType: defaultChart } }));
  }, []);

  const handleRemove = useCallback((zoneId: string) => {
    setZones(prev => { const next = { ...prev }; delete next[zoneId]; return next; });
  }, []);

  const handleChartChange = useCallback((zoneId: string, chartType: string) => {
    setZones(prev => ({ ...prev, [zoneId]: { ...prev[zoneId], chartType } }));
  }, []);

  const isPreview = mode === 'preview';

  return (
    <ThemeCtx.Provider value={light}>
    <div className="min-h-screen" style={{ background: L ? '#f8fafc' : 'var(--dark-gray)', color: L ? '#1e293b' : '#fff', transition: 'background 0.3s, color 0.3s' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${L ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`, background: L ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 className="text-2xl sm:text-3xl font-bold" style={{ color: L ? '#0f172a' : '#fff' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
                Spending Dashboard
              </motion.h1>
              <motion.p className="mt-1 text-sm" style={{ color: L ? '#64748b' : 'rgba(255,255,255,0.4)' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                {isPreview ? 'Preview your dashboard — this is how it will look when shipped' : 'Build your dashboard by dragging KPI dimensions into the grid'}
              </motion.p>
            </div>
            <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: `1px solid ${L ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}` }}>
                <button onClick={() => setMode('edit')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all"
                  style={{ background: !isPreview ? 'rgba(99,102,241,0.15)' : (L ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'), color: !isPreview ? '#6366f1' : (L ? '#475569' : 'rgba(255,255,255,0.4)') }}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setMode('preview')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all"
                  style={{ background: isPreview ? 'rgba(99,102,241,0.15)' : (L ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'), color: isPreview ? '#6366f1' : (L ? '#475569' : 'rgba(255,255,255,0.4)') }}>
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
              <button onClick={() => setShowSubmitModal(true)} disabled={widgetCount === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/15 disabled:opacity-30 disabled:cursor-not-allowed">
                <Send className="w-3.5 h-3.5" /> Submit
              </button>
              <button onClick={() => setLight(v => !v)} className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 text-sm" style={{ background: L ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)', border: `1px solid ${L ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}`, color: L ? '#475569' : 'rgba(255,255,255,0.5)' }}>
                {L ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </motion.div>
          </div>
          {widgetCount > 0 && (
            <motion.div className="mt-3 flex items-center gap-2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 font-medium">
                {widgetCount} of {DROP_ZONES.length} zones configured
              </span>
              {widgetCount === DROP_ZONES.length && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to submit
                </span>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* Alerts & Insights — moved to top */}
        <div>
          <motion.h2 className="text-lg font-bold mb-4" style={{ color: L ? '#0f172a' : '#fff' }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Alerts & Insights
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALERTS.map((alert, i) => <AlertCard key={alert.id} alert={alert} index={i} />)}
          </div>
        </div>

        {/* Dashboard Builder */}
        <div className="flex flex-col lg:flex-row gap-6">
          {!isPreview && (
            <aside className="lg:w-48 shrink-0" style={{ alignSelf: 'flex-start', position: 'sticky', top: 96, zIndex: 20 }}>
              <div className="rounded-2xl backdrop-blur-md p-3" style={{ background: L ? '#fff' : 'var(--dark-gray)', border: `1px solid ${L ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}` }}>
                <h3 className="text-[11px] font-semibold mb-3 px-1 uppercase tracking-wider" style={{ color: L ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)' }}>KPI Dimensions</h3>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  {KPI_DIMENSIONS.map((widget) => (
                    <div key={widget.id} draggable onDragStart={(e) => { e.dataTransfer.setData('text/kpi-dimension', widget.id); e.dataTransfer.effectAllowed = 'copy'; }}>
                      <PaletteItem widget={widget} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${L ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}` }}>
                  <p className="text-xs leading-relaxed px-1" style={{ color: L ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)' }}>Drag a dimension into a zone, then choose a chart type from the dropdown.</p>
                </div>
              </div>
            </aside>
          )}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto">
              {DROP_ZONES
                .filter((zone) => !isPreview || zones[zone.id])
                .map((zone) => (
                <DashboardZone key={zone.id} zone={zone} widget={zones[zone.id] || null} mode={mode}
                  onDrop={handleDrop} onRemove={handleRemove} onChartChange={handleChartChange} />
              ))}
            </div>
          </div>
        </div>

        {/* Spending Heatmap */}
        <div>
          <motion.h2 className="text-lg font-bold mb-4" style={{ color: L ? '#0f172a' : '#fff' }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Spending Activity
          </motion.h2>
          <SpendingHeatmap data={HEATMAP_DATA} light={L} />
        </div>

        {/* Employee Lookup */}
        <div>
          <motion.h2 className="text-lg font-bold mb-4" style={{ color: L ? '#0f172a' : '#fff' }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Employee Lookup
          </motion.h2>
          <EmployeeLookup />
        </div>
      </div>

      {showSubmitModal && <SubmitModal onClose={() => setShowSubmitModal(false)} widgetCount={widgetCount} />}
    </div>
    </ThemeCtx.Provider>
  );
}
