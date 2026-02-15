'use client';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';

// Preset swatches
const PRESETS = [
  '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#64748b', '#334155', '#1e293b', '#0f172a', '#000000',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6366f1', '#a855f7', '#ec4899',
  '#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#bfdbfe', '#c7d2fe', '#e9d5ff', '#fbcfe8',
  '#991b1b', '#9a3412', '#854d0e', '#166534', '#115e59', '#1e40af', '#3730a3', '#6b21a8', '#9d174d',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export default function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position when opening
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const popupW = 280;
      const viewW = window.innerWidth;

      // Try to position to the right of the trigger
      let left = rect.right + 12;

      // If not enough room on right, position to the left
      if (left + popupW > viewW - 20) {
        left = rect.left - popupW - 12;
      }

      // If still not enough room, center in viewport
      if (left < 20) {
        left = Math.max(20, (viewW - popupW) / 2);
      }

      // Vertically align with trigger
      let top = rect.top;

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
          popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const popup = open && mounted ? createPortal(
    <div
      ref={popupRef}
      className="w-[280px] rounded-2xl shadow-2xl overflow-hidden"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: 'rgba(15,17,30,.98)',
        border: '1px solid rgba(255,255,255,.1)',
        zIndex: 999999,
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Color Picker</span>
        <button
          onClick={() => setOpen(false)}
          className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Color picker */}
        <div className="color-picker-wrapper">
          <HexColorPicker color={value} onChange={onChange} style={{ width: '100%', height: '180px' }} />
        </div>

        {/* Hex input */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg border border-white/10 shrink-0" style={{ background: value }} />
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono">#</span>
            <input
              type="text"
              value={value.replace('#', '')}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                if (raw.length === 6) {
                  onChange('#' + raw.toLowerCase());
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
          <div className="grid grid-cols-6 gap-1.5">
            {PRESETS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className="w-full aspect-square rounded-md border transition-all hover:scale-110"
                style={{
                  background: c,
                  borderColor: value.toLowerCase() === c ? 'rgba(99,102,241,.7)' : 'rgba(255,255,255,.06)',
                  boxShadow: value.toLowerCase() === c ? '0 0 0 1px rgba(99,102,241,.4)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Styles for react-colorful */}
      <style jsx global>{`
        .color-picker-wrapper .react-colorful {
          border-radius: 12px;
          overflow: hidden;
        }
        .color-picker-wrapper .react-colorful__saturation {
          border-radius: 12px 12px 0 0;
          border-bottom: none;
        }
        .color-picker-wrapper .react-colorful__hue {
          height: 12px;
          border-radius: 0 0 12px 12px;
        }
        .color-picker-wrapper .react-colorful__pointer {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-9 rounded-lg cursor-pointer border border-white/10 hover:border-white/20 transition-all relative overflow-hidden group ${className || ''}`}
        style={{ background: value }}
      >
        {/* Checkerboard pattern for transparency */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#666 75%),linear-gradient(45deg,#666 25%,transparent 25%,transparent 75%,#666 75%)',
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0,4px 4px'
          }}
        />
        <div className="absolute inset-0" style={{ background: value }} />
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10"
          style={{
            color: parseInt(value.slice(1), 16) > 0x888888 ? '#000' : '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,.5)'
          }}
        >
          {value.toUpperCase()}
        </span>
      </button>

      {/* Portal popup */}
      {popup}
    </>
  );
}
