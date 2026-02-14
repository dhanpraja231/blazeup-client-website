'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

// ========== HSV ↔ HEX helpers ==========
function hexToHsv(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hueToHex(h: number): string { return hsvToHex(h, 1, 1); }

// ========== Preset swatches ==========
const PRESETS = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#64748b', '#334155', '#1e293b', '#0f172a', '#000000',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
  '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#bfdbfe', '#c7d2fe', '#e9d5ff', '#fbcfe8',
  '#991b1b', '#9a3412', '#854d0e', '#166534', '#115e59', '#1e40af', '#3730a3', '#6b21a8', '#9d174d',
];

// ========== Component ==========
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export default function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [hexInput, setHexInput] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const satRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const draggingSat = useRef(false);
  const draggingHue = useRef(false);

  // Sync from parent when value changes externally
  useEffect(() => {
    if (value !== hsvToHex(hsv[0], hsv[1], hsv[2])) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
      setHexInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const emitColor = useCallback((h: number, s: number, v: number) => {
    const hex = hsvToHex(h, s, v);
    setHexInput(hex);
    onChange(hex);
  }, [onChange]);

  // ---- Saturation/Brightness area ----
  const handleSatMove = useCallback((clientX: number, clientY: number) => {
    const rect = satRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    const newHsv: [number, number, number] = [hsv[0], s, v];
    setHsv(newHsv);
    emitColor(newHsv[0], newHsv[1], newHsv[2]);
  }, [hsv, emitColor]);

  const onSatDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingSat.current = true;
    handleSatMove(e.clientX, e.clientY);
    const onMove = (ev: MouseEvent) => { if (draggingSat.current) handleSatMove(ev.clientX, ev.clientY); };
    const onUp = () => { draggingSat.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [handleSatMove]);

  // ---- Hue slider ----
  const handleHueMove = useCallback((clientX: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(359, ((clientX - rect.left) / rect.width) * 360));
    const newHsv: [number, number, number] = [h, hsv[1], hsv[2]];
    setHsv(newHsv);
    emitColor(newHsv[0], newHsv[1], newHsv[2]);
  }, [hsv, emitColor]);

  const onHueDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingHue.current = true;
    handleHueMove(e.clientX);
    const onMove = (ev: MouseEvent) => { if (draggingHue.current) handleHueMove(ev.clientX); };
    const onUp = () => { draggingHue.current = false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [handleHueMove]);

  // ---- Hex input ----
  const onHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setHexInput(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      const newHsv = hexToHsv(v);
      setHsv(newHsv);
      onChange(v.toLowerCase());
    }
  };

  const currentHex = hsvToHex(hsv[0], hsv[1], hsv[2]);

  return (
    <div ref={wrapperRef} className={`relative ${className || ''}`} style={{ zIndex: open ? 200 : 'auto' }}>
      {/* Swatch trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 rounded-lg cursor-pointer border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group"
        style={{ background: currentHex }}
      >
        {/* Checkerboard for dark colors */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#666 75%),linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#666 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0,4px 4px', zIndex: 0 }} />
        <div className="absolute inset-0" style={{ background: currentHex, zIndex: 1 }} />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10"
          style={{ color: hsv[2] > 0.5 && hsv[1] < 0.5 ? '#000' : '#fff', textShadow: '0 1px 2px rgba(0,0,0,.5)' }}>
          {currentHex.toUpperCase()}
        </span>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute left-0 top-full mt-2 w-[260px] rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(15,17,30,.96)', border: '1px solid rgba(255,255,255,.08)', backdropFilter: 'blur(20px)', zIndex: 210 }}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Color Picker</span>
            <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
          </div>

          <div className="p-3 space-y-3">
            {/* Saturation / Brightness area */}
            <div ref={satRef} onMouseDown={onSatDown}
              className="relative w-full h-[140px] rounded-xl cursor-crosshair overflow-hidden"
              style={{ background: hueToHex(hsv[0]) }}>
              {/* White → transparent left-to-right */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }} />
              {/* Transparent → black top-to-bottom */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, #000)' }} />
              {/* Picker dot */}
              <div className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none"
                style={{ left: `${hsv[1] * 100}%`, top: `${(1 - hsv[2]) * 100}%`, transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 1px rgba(0,0,0,.3), 0 2px 8px rgba(0,0,0,.4)' }} />
            </div>

            {/* Hue slider */}
            <div ref={hueRef} onMouseDown={onHueDown}
              className="relative w-full h-3 rounded-full cursor-pointer"
              style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}>
              <div className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg pointer-events-none -top-0.5"
                style={{ left: `${(hsv[0] / 360) * 100}%`, transform: 'translateX(-50%)', background: hueToHex(hsv[0]), boxShadow: '0 0 0 1px rgba(0,0,0,.3), 0 2px 6px rgba(0,0,0,.4)' }} />
            </div>

            {/* Hex + preview */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-white/10 shrink-0" style={{ background: currentHex }} />
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">#</span>
                <input
                  type="text"
                  value={hexInput.replace('#', '')}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                    setHexInput('#' + raw);
                    if (raw.length === 6) {
                      const hex = '#' + raw;
                      const newHsv = hexToHsv(hex);
                      setHsv(newHsv);
                      onChange(hex.toLowerCase());
                    }
                  }}
                  className="w-full rounded-lg pl-6 pr-2 py-1.5 text-xs font-mono text-white bg-white/5 border border-white/10 focus:border-indigo-500/40 focus:outline-none transition-colors"
                  maxLength={6}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1.5 block">Presets</span>
              <div className="grid grid-cols-9 gap-1">
                {PRESETS.map(c => (
                  <button key={c} type="button"
                    onClick={() => { const newHsv = hexToHsv(c); setHsv(newHsv); setHexInput(c); onChange(c); }}
                    className="w-full aspect-square rounded-md border transition-all hover:scale-110"
                    style={{ background: c, borderColor: currentHex === c ? 'rgba(99,102,241,.7)' : 'rgba(255,255,255,.06)', boxShadow: currentHex === c ? '0 0 0 1px rgba(99,102,241,.4)' : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
