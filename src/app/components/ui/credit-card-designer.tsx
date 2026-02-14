
'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import AITemplateGenerator from './AITemplateGenerator';
import AICardGenerator from './AICardGenerator';
import {
  CreditCard, Type, Circle, Square, Trash2, Undo2, Redo2, Upload,
  Sparkles, Heart, Star, Zap, Shield, Lock, Globe, Wifi, Battery,
  Sun, Moon, Cloud, Palette, Image as ImageIcon, ChevronDown,
  FlipHorizontal, AlertTriangle, X, Move, RotateCw, Wand2,
  Plus, Clipboard, Layers, Link2, Unlink2,
} from 'lucide-react';
import { processImageBackground } from './backgroundremoval';
import ColorPicker from './color-picker';
import { CARD_LAYOUTS, type LayoutId } from './layouts';
// ====================== TYPES ======================
type CardFace = 'front' | 'back';
type NetworkType = 'Visa' | 'Mastercard' | 'RuPay' | 'Amex';
interface PatternState { id: string | null; color: string; opacity: number; scale: number; }
const DEFAULT_PATTERN: PatternState = { id: null, color: '#ffffff', opacity: 0.06, scale: 1 };

// ============ PREDEFINED CARD PATTERNS ============
const CARD_PATTERNS = [
  { id: 'geometric', name: 'Geometric', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${60*scale}' height='${60*scale}'><g fill='none' stroke='${color}' stroke-width='0.8'><rect x='${5*scale}' y='${5*scale}' width='${20*scale}' height='${20*scale}' transform='rotate(45 ${15*scale} ${15*scale})'/><rect x='${35*scale}' y='${5*scale}' width='${20*scale}' height='${20*scale}' transform='rotate(45 ${45*scale} ${15*scale})'/><rect x='${5*scale}' y='${35*scale}' width='${20*scale}' height='${20*scale}' transform='rotate(45 ${15*scale} ${45*scale})'/><rect x='${35*scale}' y='${35*scale}' width='${20*scale}' height='${20*scale}' transform='rotate(45 ${45*scale} ${45*scale})'/><line x1='0' y1='${30*scale}' x2='${60*scale}' y2='${30*scale}'/><line x1='${30*scale}' y1='0' x2='${30*scale}' y2='${60*scale}'/></g></svg>` },
  { id: 'tessellation', name: 'Tessellation', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${80*scale}' height='${80*scale}'><g fill='none' stroke='${color}' stroke-width='0.6'><polygon points='${40*scale},${2*scale} ${78*scale},${20*scale} ${78*scale},${60*scale} ${40*scale},${78*scale} ${2*scale},${60*scale} ${2*scale},${20*scale}'/><line x1='${40*scale}' y1='${2*scale}' x2='${40*scale}' y2='${78*scale}'/><line x1='${2*scale}' y1='${20*scale}' x2='${78*scale}' y2='${60*scale}'/><line x1='${78*scale}' y1='${20*scale}' x2='${2*scale}' y2='${60*scale}'/></g></svg>` },
  { id: 'waves', name: 'Waves', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${120*scale}' height='${20*scale}'><g fill='none' stroke='${color}' stroke-width='1.2' stroke-linecap='round'><path d='M0,${10*scale} Q${15*scale},${2*scale} ${30*scale},${10*scale} Q${45*scale},${18*scale} ${60*scale},${10*scale} Q${75*scale},${2*scale} ${90*scale},${10*scale} Q${105*scale},${18*scale} ${120*scale},${10*scale}'/></g></svg>` },
  { id: 'chevron', name: 'Chevron', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${40*scale}' height='${24*scale}'><g fill='none' stroke='${color}' stroke-width='1'><path d='M0,${24*scale} L${20*scale},${12*scale} L${40*scale},${24*scale}'/><path d='M0,${12*scale} L${20*scale},0 L${40*scale},${12*scale}'/></g></svg>` },
  { id: 'hexagons', name: 'Hexagons', svg: (color: string, scale: number) => { const s = 20 * scale; const h = s * Math.sqrt(3); return `<svg xmlns='http://www.w3.org/2000/svg' width='${s*3}' height='${h}'><g fill='none' stroke='${color}' stroke-width='0.6'><polygon points='${s},0 ${s*2},0 ${s*2.5},${h/2} ${s*2},${h} ${s},${h} ${s*0.5},${h/2}'/><polygon points='${s*2.5},${h/2} ${s*3},0 ${s*3},0'/></g></svg>`; } },
  { id: 'crosshatch', name: 'Crosshatch', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${20*scale}' height='${20*scale}'><g stroke='${color}' stroke-width='0.5'><line x1='0' y1='0' x2='${20*scale}' y2='${20*scale}'/><line x1='${20*scale}' y1='0' x2='0' y2='${20*scale}'/></g></svg>` },
  { id: 'circles', name: 'Circles', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${40*scale}' height='${40*scale}'><g fill='none' stroke='${color}' stroke-width='0.6'><circle cx='${20*scale}' cy='${20*scale}' r='${8*scale}'/><circle cx='0' cy='0' r='${8*scale}'/><circle cx='${40*scale}' cy='0' r='${8*scale}'/><circle cx='0' cy='${40*scale}' r='${8*scale}'/><circle cx='${40*scale}' cy='${40*scale}' r='${8*scale}'/></g></svg>` },
  { id: 'topographic', name: 'Topographic', svg: (color: string, scale: number) => `<svg xmlns='http://www.w3.org/2000/svg' width='${100*scale}' height='${100*scale}'><g fill='none' stroke='${color}' stroke-width='0.6'><ellipse cx='${50*scale}' cy='${50*scale}' rx='${45*scale}' ry='${30*scale}'/><ellipse cx='${50*scale}' cy='${50*scale}' rx='${30*scale}' ry='${18*scale}'/><ellipse cx='${50*scale}' cy='${50*scale}' rx='${15*scale}' ry='${8*scale}'/></g></svg>` },
];
interface CardElement {
  id: string;
  type: 'text' | 'cardNumber' | 'circle' | 'rectangle' | 'icon' | 'image';
  face: CardFace;
  x: number; y: number; width: number; height: number;
  content: string; color: string; fontSize: number;
  backgroundColor: string; opacity: number;
  iconName?: string; imageData?: string;
  rotation: number; fontFamily?: string; letterSpacing?: number;
  fontWeight?: number;
  isHardware?: boolean;
  isPositionLocked?: boolean;
  isBackgroundRemoved?: boolean;
  originalImageData?: string;
  isLinkedGroup?: boolean;
}
interface HistoryState {
  frontElements: CardElement[];
  backElements: CardElement[];
  frontBg: string; backBg: string;
  network: NetworkType;
}
interface KeepOutZone { x: number; y: number; w: number; h: number; label: string; }
interface Toast { message: string; type: 'info' | 'warn' | 'error'; }
// ====================== ISO 7810 CONSTANTS ======================
const CARD = { W: 428, H: 270, R: 16, MARGIN: 15 };
const uid = () => `el-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const KEEP_OUT: Record<string, KeepOutZone> = {
  chip:      { x: 47.5, y: 92.5, w: 55, h: 42.5, label: 'EMV Chip' },
  magstripe: { x: 0,  y: 0,  w: CARD.W, h: 62.5, label: 'Magnetic Stripe' },
};
const GRADIENTS = [
  { name: 'Obsidian', value: 'linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 50%,#0d0d2b 100%)' },
  { name: 'Royal',    value: 'linear-gradient(135deg,#141e30 0%,#243b55 100%)' },
  { name: 'Ember',    value: 'linear-gradient(135deg,#1a0a0a 0%,#4a1515 50%,#2d0808 100%)' },
  { name: 'Aurora',   value: 'linear-gradient(145deg,#0a1628 0%,#1a3a5c 40%,#0d4f4f 70%,#0a2818 100%)' },
  { name: 'Platinum', value: 'linear-gradient(135deg,#2c2c3a 0%,#3d3d52 50%,#1e1e2e 100%)' },
  { name: 'Sunset',   value: 'linear-gradient(135deg,#2d1b4e 0%,#5c2d82 40%,#8b3a62 70%,#c9485b 100%)' },
  { name: 'Ocean',    value: 'linear-gradient(135deg,#0a192f 0%,#0d3b66 50%,#114b5f 100%)' },
  { name: 'Gold',     value: 'linear-gradient(135deg,#1a1a0a 0%,#4a3f15 50%,#8b7320 100%)' },
];
const FONT_FAMILIES = [
  { name: 'Inter', value: "'Inter',sans-serif" },
  { name: 'Courier', value: "'Courier New',monospace" },
  { name: 'Arial', value: "Arial,sans-serif" },
  { name: 'Georgia', value: "Georgia,serif" },
  { name: 'System', value: "system-ui,sans-serif" },
];
const DEFAULT_ICONS = [
  { name: 'Sparkles', component: Sparkles }, { name: 'Heart', component: Heart },
  { name: 'Star', component: Star }, { name: 'Zap', component: Zap },
  { name: 'Shield', component: Shield }, { name: 'Lock', component: Lock },
  { name: 'Globe', component: Globe }, { name: 'Wifi', component: Wifi },
  { name: 'Battery', component: Battery }, { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon }, { name: 'Cloud', component: Cloud },
];
// ====================== COLOR HELPERS ======================
function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function generateSpotlightGradient(hex: string, x = 30, y = 30): string {
  const [h, s, l] = hexToHSL(hex);
  const tint = hslToHex(h, Math.max(s - 5, 0), Math.min(l + 20, 95));
  const shade = hslToHex(h, Math.min(s + 10, 100), Math.max(l - 30, 5));
  return `radial-gradient(circle at ${x}% ${y}%, ${tint}, ${hex}, ${shade})`;
}
// ====================== BACKGROUND REMOVAL ======================
// processImageBackground is now imported from ./backgroundremoval
// ====================== SVG COMPONENTS ======================
function ChipSVG({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 56 44" fill="none">
      <rect x=".5" y=".5" width="55" height="43" rx="5" fill="url(#cg)" stroke="rgba(255,255,255,.15)"/>
      <line x1="0" y1="16" x2="56" y2="16" stroke="rgba(255,255,255,.12)" strokeWidth=".8"/>
      <line x1="0" y1="28" x2="56" y2="28" stroke="rgba(255,255,255,.12)" strokeWidth=".8"/>
      <line x1="20" y1="0" x2="20" y2="44" stroke="rgba(255,255,255,.08)" strokeWidth=".8"/>
      <line x1="36" y1="0" x2="36" y2="44" stroke="rgba(255,255,255,.08)" strokeWidth=".8"/>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="56" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c9a84c"/><stop offset=".5" stopColor="#f0d56e"/><stop offset="1" stopColor="#c9a84c"/>
      </linearGradient></defs>
    </svg>
  );
}
function MagstripeSVG({ width, height, vertical }: { width?: number; height?: number; vertical?: boolean }) {
  if (vertical) {
    const h = height || CARD.W;
    const w = width || 62.5;
    return (
      <div style={{ width: w, height: h, background: 'linear-gradient(90deg,#1a1a1a 0%,#2a2a2a 40%,#1a1a1a 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: (w - 36) / 2, top: 0, bottom: 0, width: 36, background: '#111', borderLeft: '1px solid #333', borderRight: '1px solid #333' }} />
      </div>
    );
  }
  const w = width || CARD.W;
  const h = height || 62.5;
  return (
    <div style={{ width: w, height: h, background: 'linear-gradient(180deg,#1a1a1a 0%,#2a2a2a 40%,#1a1a1a 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: (h - 36) / 2, left: 0, right: 0, height: 36, background: '#111', borderTop: '1px solid #333', borderBottom: '1px solid #333' }} />
    </div>
  );
}

function HologramSVG() {
  return (
    <div style={{ width: 34, height: 28, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,rgba(99,102,241,.3),rgba(236,72,153,.3),rgba(34,211,238,.3),rgba(163,230,53,.3))', filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,.2)', borderRadius: 4 }} />
    </div>
  );
}
function NetworkLogo({ type, size = 40 }: { type: NetworkType; size?: number }) {
  const s = size;
  if (type === 'Visa') return <svg width={s*1.6} height={s} viewBox="0 0 64 40" fill="none"><text x="4" y="30" fill="#fff" fontSize="22" fontWeight="bold" fontFamily="Arial" fontStyle="italic" letterSpacing="-1">VISA</text></svg>;
  if (type === 'Mastercard') return <svg width={s*1.4} height={s} viewBox="0 0 56 40"><circle cx="20" cy="20" r="14" fill="#EB001B" opacity=".9"/><circle cx="36" cy="20" r="14" fill="#F79E1B" opacity=".9"/><path d="M28 9.4a14 14 0 010 21.2 14 14 0 000-21.2z" fill="#FF5F00" opacity=".9"/></svg>;
  if (type === 'Amex') return <svg width={s*1.6} height={s} viewBox="0 0 64 40" fill="none"><text x="2" y="28" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="Arial">AMEX</text></svg>;
  return <svg width={s*1.4} height={s} viewBox="0 0 56 40" fill="none"><text x="4" y="28" fill="#fff" fontSize="13" fontWeight="bold" fontFamily="Arial">RuPay</text></svg>;
}
// ====================== TEMPLATES ======================

const CARD_TEMPLATES = [
  { name: 'Classic Dark', bg: 'linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 50%,#0d0d2b 100%)', backBg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)' },
  { name: 'Ocean Blue', bg: 'linear-gradient(135deg,#0a192f 0%,#0d3b66 50%,#114b5f 100%)', backBg: 'linear-gradient(135deg,#0a192f 0%,#0d3b66 100%)' },
  { name: 'Sunset Gold', bg: 'linear-gradient(135deg,#1a1a0a 0%,#4a3f15 50%,#8b7320 100%)', backBg: 'linear-gradient(135deg,#2a2010 0%,#6b5a20 100%)' },
];

function createFrontTemplate(): CardElement[] {
  return [
    // Bank name/logo — position locked but resizable & styleable
    { id: 'hw-bankname', type: 'text', face: 'front', x: CARD.MARGIN, y: CARD.MARGIN, width: 200, height: 26, content: 'BLAZEUP BANK', color: '#fff', fontSize: 17, backgroundColor: 'transparent', opacity: .9, rotation: 0, fontFamily: "'Inter',sans-serif", letterSpacing: 4, fontWeight: 600, isPositionLocked: true },
    // EMV Chip — ISO 7816: fully locked hardware
    { id: 'hw-chip', type: 'image', face: 'front', x: 47.5, y: 92.5, width: 55, height: 42.5, content: '', color: '#fff', fontSize: 16, backgroundColor: 'transparent', opacity: 1, rotation: 0, imageData: 'CHIP', isHardware: true },
    // Contactless / NFC icon — fully movable & resizable
    { id: 'hw-contactless', type: 'icon', face: 'front', x: 118, y: 145, width: 28, height: 28, content: '', color: 'rgba(255,255,255,.55)', fontSize: 16, backgroundColor: 'transparent', opacity: .55, iconName: 'Wifi', rotation: 90 },
    // Account holder name — MOVABLE
    { id: 'hw-cardholder-name', type: 'text', face: 'front', x: 24, y: 224, width: 220, height: 22, content: 'YOUR NAME HERE', color: '#fff', fontSize: 14, backgroundColor: 'transparent', opacity: .9, rotation: 0, fontFamily: "'Inter',sans-serif", letterSpacing: 2, fontWeight: 500 },
  ];
}

function createBackTemplate(orient: 'horizontal' | 'vertical', network: NetworkType): CardElement[] {
  const cw = orient === 'horizontal' ? CARD.W : CARD.H;
  const ch = orient === 'horizontal' ? CARD.H : CARD.W;
  const isV = orient === 'vertical';

  // Magstripe: landscape = horizontal band at 28px from top; portrait = vertical bar on RIGHT edge with padding
  // Account info: landscape = mid-left area; portrait = left side near top
  const acctX = isV ? 24 : 24;
  const acctY = isV ? 28 : ch - 90;
  const acctContent = isV ? '4532\n8720\n1456\n7890' : '4532  8720  1456  7890';
  const acctH = isV ? 70 : 20;

  return [
    // Magnetic stripe — thickness 12.5mm (62.5px); 5mm (25px) from top (landscape) or right (portrait)
    { id: 'hw-magstripe', type: 'image', face: 'back', x: isV ? cw - 25 - 62.5 : 0, y: isV ? 0 : 25, width: isV ? 62.5 : cw, height: isV ? ch : 62.5, content: '', color: '#fff', fontSize: 16, backgroundColor: 'transparent', opacity: 1, rotation: 0, imageData: 'MAGSTRIPE', isHardware: true },
    // Hologram — bottom-right; in vertical mode shifted left to clear magstripe (magstripe left edge = cw-87.5)
    { id: 'hw-hologram', type: 'image', face: 'back', x: isV ? cw - 130 : cw - 54, y: ch - 48, width: 34, height: 28, content: '', color: '#fff', fontSize: 16, backgroundColor: 'transparent', opacity: 1, rotation: 0, imageData: 'HOLOGRAM', isHardware: true },
    // Network logo — 4px gap left of hologram
    { id: 'hw-network', type: 'text', face: 'back', x: isV ? cw - 199 : cw - 123, y: ch - 50, width: 65, height: 36, content: network, color: '#fff', fontSize: 16, backgroundColor: 'transparent', opacity: 1, rotation: 0, isHardware: true },
    // Linked account info group — moves as one unit
    { id: 'hw-acctinfo', type: 'text', face: 'back', x: acctX, y: acctY, width: isV ? cw - 48 : 240, height: acctH + 24, content: acctContent, color: '#fff', fontSize: isV ? 13 : 14, backgroundColor: 'transparent', opacity: 1, rotation: 0, fontFamily: "'Courier New',monospace", letterSpacing: 3, fontWeight: 500, isLinkedGroup: true },
    { id: 'hw-cvv', type: 'text', face: 'back', x: acctX, y: acctY + acctH + 2, width: 100, height: 16, content: 'CVV: 123', color: 'rgba(255,255,255,.7)', fontSize: 10, backgroundColor: 'transparent', opacity: 1, rotation: 0, fontFamily: "'Courier New',monospace", letterSpacing: 2, isLinkedGroup: true },
    { id: 'hw-expiry', type: 'text', face: 'back', x: acctX, y: acctY + acctH + 18, width: 140, height: 16, content: 'VALID THRU: 12/28', color: 'rgba(255,255,255,.7)', fontSize: 10, backgroundColor: 'transparent', opacity: 1, rotation: 0, fontFamily: "'Courier New',monospace", letterSpacing: 2, isLinkedGroup: true },
    // Fine print
    { id: 'hw-fine-print', type: 'text', face: 'back', x: 24, y: ch - 24, width: cw - 48, height: 14, content: 'This card is property of the issuing bank.', color: 'rgba(255,255,255,.35)', fontSize: 7, backgroundColor: 'transparent', opacity: 1, rotation: 0, letterSpacing: .5 },
  ];
}
export default function CreditCardDesigner() {
    // Add this to your state declarations (around line 280)
    const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [activeFace, setActiveFace] = useState<CardFace>('front');
  const [network, setNetwork] = useState<NetworkType>('Visa');
  const [frontElements, setFrontElements] = useState<CardElement[]>(() => createFrontTemplate());
  const [backElements, setBackElements] = useState<CardElement[]>(() => createBackTemplate('horizontal', 'Visa'));
  const [frontBg, setFrontBg] = useState(GRADIENTS[0].value);
  const [backBg, setBackBg] = useState('linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<string | null>('components');
  const [collisionWarn, setCollisionWarn] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [spotlightColor, setSpotlightColor] = useState('#1a1a3e');
  const [spotlightX, setSpotlightX] = useState(30);
  const [spotlightY, setSpotlightY] = useState(30);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showTemplateModal, setShowTemplateModal] = useState(true);
  const [canvasLightMode, setCanvasLightMode] = useState(false);
  // Background removal parameters (from backgroundslider.html)
  const [bgRemovalTolerance, setBgRemovalTolerance] = useState(0.05);
  const [bgRemovalFade, setBgRemovalFade] = useState(0.10);
  const [bgRemovalKeepInternal, setBgRemovalKeepInternal] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Image clipboard
  const [imageClipboard, setImageClipboard] = useState<{ id: string; dataUrl: string; name: string }[]>([]);
  // Pattern overlay (per face)
  const [frontPattern, setFrontPattern] = useState<PatternState>({ ...DEFAULT_PATTERN });
  const [backPattern, setBackPattern] = useState<PatternState>({ ...DEFAULT_PATTERN });
  // Sync faces toggle
  const [syncFaces, setSyncFaces] = useState(false);
  const activePattern = activeFace === 'front' ? frontPattern : backPattern;
  const setActivePattern = activeFace === 'front' ? setFrontPattern : setBackPattern;
  // Layout state (per face)
  interface LayoutState { id: LayoutId; baseColor: string; overlayColor: string; }
  const [frontLayout, setFrontLayout] = useState<LayoutState>({ id: 'none', baseColor: '#1a1a2e', overlayColor: '#2d1b69' });
  const [backLayout, setBackLayout] = useState<LayoutState>({ id: 'none', baseColor: '#1a1a2e', overlayColor: '#2d1b69' });
  const activeLayout = activeFace === 'front' ? frontLayout : backLayout;
  const setActiveLayout = activeFace === 'front' ? setFrontLayout : setBackLayout;
  // Computed card dimensions based on orientation
  const cardW = orientation === 'horizontal' ? CARD.W : CARD.H;
  const cardH = orientation === 'horizontal' ? CARD.H : CARD.W;
  const [history, setHistory] = useState<HistoryState[]>([{
    frontElements: createFrontTemplate(), backElements: createBackTemplate('horizontal', 'Visa'),
    frontBg: GRADIENTS[0].value, backBg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', network: 'Visa',
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const flipContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clipboardInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number; startX: number; startY: number } | null>(null);
  const clickedElementRef = useRef(false); // F1: track if click originated from element
  const rafRef = useRef<number>(0); // requestAnimationFrame ID for smooth drag
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // wrapper for sticky scroll
  const canvasOriginalTop = useRef<number>(0); // cached original top offset
  const elements = activeFace === 'front' ? frontElements : backElements;
  const setElements = activeFace === 'front' ? setFrontElements : setBackElements;
  const cardBg = activeFace === 'front' ? frontBg : backBg;
  const setCardBg = activeFace === 'front' ? setFrontBg : setBackBg;
  const elementsRef = useRef(elements);
  elementsRef.current = elements;
  // ---- toast auto-dismiss ----
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  // ---- sync front → back ----
  useEffect(() => {
    if (!syncFaces) return;
    setBackBg(frontBg);
    setBackPattern({ ...frontPattern });
    setBackLayout({ ...frontLayout });
  }, [syncFaces, frontBg, frontPattern, frontLayout]);
  // ---- history ----
  const snap = useCallback((): HistoryState => ({
    frontElements: activeFace === 'front' ? elementsRef.current : frontElements,
    backElements: activeFace === 'back' ? elementsRef.current : backElements,
    frontBg, backBg, network,
  }), [activeFace, frontElements, backElements, frontBg, backBg, network]);
  const pushHistory = useCallback(() => {
    const s = snap();
    setHistory(prev => { const sl = prev.slice(0, historyIndex + 1); sl.push(s); return sl; });
    setHistoryIndex(prev => prev + 1);
  }, [snap, historyIndex]);
  const applyState = useCallback((s: HistoryState) => {
    setFrontElements(s.frontElements); setBackElements(s.backElements);
    setFrontBg(s.frontBg); setBackBg(s.backBg); setNetwork(s.network);
  }, []);
  const undo = useCallback(() => {
    if (historyIndex > 0) { applyState(history[historyIndex - 1]); setHistoryIndex(historyIndex - 1); }
  }, [historyIndex, history, applyState]);
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) { applyState(history[historyIndex + 1]); setHistoryIndex(historyIndex + 1); }
  }, [historyIndex, history, applyState]);
  // ---- keyboard ----
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      else if (e.key === 'Delete' && selectedElement) {
        const el = elements.find(i => i.id === selectedElement);
        if (el && !el.isHardware) deleteElement(selectedElement);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [undo, redo, selectedElement, elements]);
  // ---- entrance ----
  useEffect(() => {
    if (flipContainerRef.current) gsap.fromTo(flipContainerRef.current, { scale: .8, opacity: 0, rotateY: -15 }, { scale: 1, opacity: 1, rotateY: 0, duration: .8, ease: 'power3.out' });
    gsap.fromTo('.sidebar-item', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: .4, stagger: .06, ease: 'power2.out', delay: .3 });
    setTimeout(() => { gsap.fromTo('.card-element', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, stagger: .08, ease: 'back.out(1.7)', delay: .1 }); }, 400);
  }, []);
  // ---- GSAP sticky canvas on scroll ----
  useEffect(() => {
    const wrapper = canvasWrapperRef.current;
    if (!wrapper) return;
    // gsap.quickTo creates a single reusable tween that smoothly interpolates — no jitter
    const setY = gsap.quickTo(wrapper, 'y', { duration: 0.4, ease: 'power3' });
    // Cache the original offset top once after layout
    const cacheTop = () => {
      gsap.set(wrapper, { y: 0 });
      canvasOriginalTop.current = wrapper.getBoundingClientRect().top + window.scrollY;
    };
    cacheTop();
    const onScroll = () => {
      if (window.innerWidth < 1024) { setY(0); return; }
      const scrollY = window.scrollY;
      const pinStart = canvasOriginalTop.current - 32;
      setY(scrollY > pinStart ? scrollY - pinStart : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', cacheTop);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', cacheTop); };
  }, []);
  // ---- collision ----
  const checkCollision = useCallback((x: number, y: number, w: number, h: number, cw: number): string | null => {
    const chipZone = { ...KEEP_OUT.chip };
    // Dynamic magstripe zone based on orientation
    const magZone = orientation === 'vertical' 
      ? { x: cw - 25 - 62.5, y: 0, w: 62.5, h: CARD.W, label: 'Magnetic Stripe' }
      : { x: 0, y: 25, w: cw, h: 62.5, label: 'Magnetic Stripe' };
    const zones = activeFace === 'front' ? [chipZone] : [magZone];
    for (const z of zones) { if (x < z.x + z.w && x + w > z.x && y < z.y + z.h && y + h > z.y) return z.label; }
    return null;
  }, [activeFace]);
  // ---- CRUD ----
  const addElement = (type: CardElement['type'], defaultValue = '') => {
    if (type === 'image') { fileInputRef.current?.click(); return; }
    const el: CardElement = {
      id: uid(), type, face: activeFace, x: 50, y: activeFace === 'back' ? 120 : 50,
      width: type === 'text' || type === 'cardNumber' ? 200 : type === 'icon' ? 40 : 80,
      height: type === 'text' || type === 'cardNumber' ? 30 : type === 'icon' ? 40 : 80,
      content: defaultValue, color: '#fff', fontSize: type === 'cardNumber' ? 20 : 16,
      backgroundColor: type === 'circle' || type === 'rectangle' ? '#fff' : 'transparent',
      opacity: type === 'circle' || type === 'rectangle' ? .2 : 1,
      iconName: type === 'icon' ? 'Sparkles' : undefined, rotation: 0, fontWeight: 400,
    };
    const next = [...elements, el];
    setElements(next); setSelectedElement(el.id); pushHistory();
    requestAnimationFrame(() => { const d = document.getElementById(`el-${el.id}`); if (d) gsap.fromTo(d, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(2)' }); });
  };
  const updateElement = (id: string, updates: Partial<CardElement>) => {
    setElements(prev => {
      const target = prev.find(el => el.id === id);
      if (!target) return prev;
      // If this element is part of a linked group, propagate certain changes to siblings
      if (target.isLinkedGroup) {
        const dx = updates.x !== undefined ? updates.x - target.x : 0;
        const dy = updates.y !== undefined ? updates.y - target.y : 0;
        // Font properties that propagate to all siblings (NOT fontSize — that stays independent)
        const sharedFontUpdates: Partial<CardElement> = {};
        if (updates.fontFamily !== undefined) sharedFontUpdates.fontFamily = updates.fontFamily;
        if (updates.fontWeight !== undefined) sharedFontUpdates.fontWeight = updates.fontWeight;
        if (updates.letterSpacing !== undefined) sharedFontUpdates.letterSpacing = updates.letterSpacing;
        if (updates.color !== undefined) sharedFontUpdates.color = updates.color;
        const hasPositionDelta = dx !== 0 || dy !== 0;
        const hasSharedFontUpdates = Object.keys(sharedFontUpdates).length > 0;
        const fontSizeChanged = updates.fontSize !== undefined;
        // Apply direct updates + shared font updates first
        let next = prev.map(el => {
          if (el.id === id) return { ...el, ...updates };
          if (el.isLinkedGroup) {
            const sibUpdates: Partial<CardElement> = {};
            if (hasPositionDelta) { sibUpdates.x = el.x + dx; sibUpdates.y = el.y + dy; }
            if (hasSharedFontUpdates) Object.assign(sibUpdates, sharedFontUpdates);
            if (Object.keys(sibUpdates).length > 0) return { ...el, ...sibUpdates };
          }
          return el;
        });
        // Reflow: when fontSize changes, auto-adjust heights and reposition to prevent overlap
        if (fontSizeChanged) {
          const groupEls = next.filter(el => el.isLinkedGroup).sort((a, b) => a.y - b.y);
          if (groupEls.length > 0) {
            let curY = groupEls[0].y;
            const gap = 4;
            const reflowed = new Map<string, { y: number; height: number }>();
            for (const gel of groupEls) {
              const lines = (gel.content?.split('\n') || ['']).length;
              const lineH = Math.round(gel.fontSize * 1.4);
              const newH = Math.max(lines * lineH + 4, 16);
              reflowed.set(gel.id, { y: curY, height: newH });
              curY += newH + gap;
            }
            next = next.map(el => {
              const r = reflowed.get(el.id);
              if (r) return { ...el, y: r.y, height: r.height };
              return el;
            });
          }
        }
        return next;
      }
      return prev.map(el => el.id === id ? { ...el, ...updates } : el);
    });
    pushHistory();
  };
  const deleteElement = (id: string) => {
    const el = elements.find(i => i.id === id);
    if (el?.isHardware) return;
    const dom = document.getElementById(`el-${id}`);
    if (dom) {
      gsap.to(dom, { scale: 0, opacity: 0, duration: .25, ease: 'power2.in', onComplete: () => {
        setElements(prev => prev.filter(e => e.id !== id)); setSelectedElement(null); pushHistory();
      }});
    } else { setElements(prev => prev.filter(e => e.id !== id)); setSelectedElement(null); pushHistory(); }
  };
  // ---- background removal ----
  const toggleBgRemoval = async (elId: string) => {
    const el = elements.find(i => i.id === elId);
    if (!el || !el.imageData || el.isHardware) return;
    if (el.isBackgroundRemoved && el.originalImageData) {
      updateElement(elId, { imageData: el.originalImageData, isBackgroundRemoved: false, originalImageData: undefined });
      return;
    }
    
    const result = await processImageBackground(el.imageData, bgRemovalTolerance, bgRemovalFade, bgRemovalKeepInternal);
    if (result) {
      updateElement(elId, { originalImageData: el.imageData, imageData: result, isBackgroundRemoved: true });
      setToast({ message: 'Background removed successfully!', type: 'info' });
    } else {
      setToast({ message: 'Could not auto-detect solid background. Please use a transparent PNG.', type: 'warn' });
    }
  };
  // Re-apply background removal with updated parameters (called when sliders/checkbox change)
  const reapplyBgRemoval = async (tol: number, fade: number, keepInt: boolean) => {
    if (!selectedElement) return;
    const el = elements.find(i => i.id === selectedElement);
    if (!el || !el.isBackgroundRemoved || !el.originalImageData) return;
    console.log('reapply bg removal');
    const result = await processImageBackground(el.originalImageData, tol, fade, keepInt);
    console.log('result', result);
    if (result) {
      updateElement(selectedElement, { imageData: result });
    }
  };
  // ---- image upload ----
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      const el: CardElement = { id: uid(), type: 'image', face: activeFace, x: 160, y: activeFace === 'back' ? 120 : 80,
        width: 80, height: 80, content: '', color: '#fff', fontSize: 16,
        backgroundColor: 'transparent', opacity: 1, imageData: data, rotation: 0 };
      const next = [...elementsRef.current, el];
      setElements(next); setSelectedElement(el.id); pushHistory();
      requestAnimationFrame(() => { const d = document.getElementById(`el-${el.id}`); if (d) gsap.fromTo(d, { scale: 0, opacity: 0, y: -30 }, { scale: 1, opacity: 1, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }); });
    };
    reader.readAsDataURL(file);
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return; processImageFile(f);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  // ---- image clipboard ----
  const addToClipboard = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setImageClipboard(prev => [...prev, { id: uid(), dataUrl, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };
  const removeFromClipboard = (id: string) => {
    setImageClipboard(prev => prev.filter(img => img.id !== id));
  };
  const addClipboardImageToCard = (dataUrl: string) => {
    const el: CardElement = {
      id: uid(), type: 'image', face: activeFace, x: 160, y: activeFace === 'back' ? 120 : 80,
      width: 80, height: 80, content: '', color: '#fff', fontSize: 16,
      backgroundColor: 'transparent', opacity: 1, imageData: dataUrl, rotation: 0,
    };
    const next = [...elementsRef.current, el];
    setElements(next); setSelectedElement(el.id); pushHistory();
    requestAnimationFrame(() => { const d = document.getElementById(`el-${el.id}`); if (d) gsap.fromTo(d, { scale: 0, opacity: 0, y: -30 }, { scale: 1, opacity: 1, y: 0, duration: .6, ease: 'elastic.out(1,.5)' }); });
  };
  const handleClipboardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    addToClipboard(e.target.files);
    if (clipboardInputRef.current) clipboardInputRef.current.value = '';
  };
  // ---- file drag onto card ----
  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.types.includes('Files')) { setIsDragOver(true);
      if (flipContainerRef.current) gsap.to(flipContainerRef.current, { scale: 1.03, boxShadow: '0 0 40px rgba(99,102,241,.5)', duration: .3, ease: 'power2.out' }); }};
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation();
    if (flipContainerRef.current && !flipContainerRef.current.contains(e.relatedTarget as Node)) { setIsDragOver(false);
      gsap.to(flipContainerRef.current, { scale: 1, boxShadow: '0 25px 60px rgba(0,0,0,.4)', duration: .3, ease: 'power2.out' }); }};
  const handleFileDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    if (flipContainerRef.current) gsap.to(flipContainerRef.current, { scale: 1, boxShadow: '0 25px 60px rgba(0,0,0,.4)', duration: .4, ease: 'elastic.out(1,.6)' });
    // Check for clipboard drag data first
    const clipboardData = e.dataTransfer.getData('text/clipboard-image');
    if (clipboardData) { addClipboardImageToCard(clipboardData); return; }
    const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) processImageFile(f); };
  // ---- element dragging (zero-overhead: everything cached on mousedown) ----
  const handleElementMouseDown = (e: React.MouseEvent, elId: string) => {
    e.preventDefault(); e.stopPropagation();
    clickedElementRef.current = true;
    const el = elements.find(i => i.id === elId);
    if (!el || el.isHardware || el.isPositionLocked) { setSelectedElement(elId); return; }
    const canvas = canvasRef.current; if (!canvas) return;
    // Cache EVERYTHING once — zero lookups in onMove
    const cachedRect = canvas.getBoundingClientRect();
    const cw = cardW, ch = cardH;
    const sx = cw / cachedRect.width, sy = ch / cachedRect.height;
    const mx = (e.clientX - cachedRect.left) * sx, my = (e.clientY - cachedRect.top) * sy;
    const origX = el.x, origY = el.y, rot = el.rotation || 0;
    const elW = el.width, elH = el.height;
    const cachedRectLeft = cachedRect.left, cachedRectTop = cachedRect.top;
    const offX = mx - el.x, offY = my - el.y;
    const dom = document.getElementById(`el-${elId}`);
    // Linked group: cache sibling DOMs & offsets for zero-overhead group drag
    const isGroup = el.isLinkedGroup;
    const siblings: { id: string; dom: HTMLElement; dx: number; dy: number }[] = [];
    if (isGroup) {
      elements.filter(s => s.isLinkedGroup && s.id !== elId).forEach(s => {
        const sd = document.getElementById(`el-${s.id}`);
        if (sd) siblings.push({ id: s.id, dom: sd, dx: s.x - origX, dy: s.y - origY });
      });
    }
    dragRef.current = { id: elId, offsetX: offX, offsetY: offY, startX: origX, startY: origY };
    setSelectedElement(elId);
    if (dom) gsap.to(dom, { scale: 1.05, duration: .15, ease: 'power2.out' });
    // onMove: ONLY math + gsap.set — no DOM reads, no array scans, no reflows
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      let nx = (ev.clientX - cachedRectLeft) * sx - offX;
      let ny = (ev.clientY - cachedRectTop) * sy - offY;
      if (nx < 0) nx = 0; else if (nx > cw - elW) nx = cw - elW;
      if (ny < 0) ny = 0; else if (ny > ch - elH) ny = ch - elH;
      dragRef.current.startX = nx;
      dragRef.current.startY = ny;
      if (dom) gsap.set(dom, { x: nx - origX, y: ny - origY, rotation: rot });
      // Move linked siblings with same delta
      if (isGroup) {
        const dx = nx - origX, dy = ny - origY;
        for (const s of siblings) gsap.set(s.dom, { x: dx, y: dy });
      }
    };
    const onUp = () => {
      if (dragRef.current) {
        const fx = dragRef.current.startX, fy = dragRef.current.startY, did = dragRef.current.id;
        const dx = fx - origX, dy = fy - origY;
        if (dom) {
          gsap.set(dom, { x: 0, y: 0, rotation: rot, left: fx, top: fy });
          gsap.to(dom, { scale: 1, duration: .2, ease: 'power2.out' });
        }
        // Check collision once on release, not during drag
        const hit = checkCollision(fx, fy, elW, elH, cw);
        if (hit) {
          const warnEl = document.getElementById('collision-warn');
          if (warnEl) { warnEl.style.display = 'flex'; warnEl.textContent = `Overlapping ${hit}`; setTimeout(() => { warnEl.style.display = 'none'; }, 2000); }
        }
        // Update all linked siblings positions — anchor to cached offsets, not state (prevents drift after resize)
        if (isGroup) {
          for (const s of siblings) {
            gsap.set(s.dom, { x: 0, y: 0, left: fx + s.dx, top: fy + s.dy });
          }
          setElements(prev => prev.map(i => {
            if (i.id === did) return { ...i, x: fx, y: fy };
            const sib = siblings.find(s => s.id === i.id);
            if (sib) return { ...i, x: fx + sib.dx, y: fy + sib.dy };
            return i;
          }));
        } else {
          setElements(prev => prev.map(i => i.id === did ? { ...i, x: fx, y: fy } : i));
        }
        pushHistory(); dragRef.current = null;
      }
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };
  // ---- resize handle ----
  const handleResizeMouseDown = (e: React.MouseEvent, elId: string, corner: string) => {
    e.preventDefault(); e.stopPropagation();
    clickedElementRef.current = true;
    const canvas = canvasRef.current; if (!canvas) return;
    const el = elements.find(i => i.id === elId); if (!el) return;
    const startW = el.width, startH = el.height, startX = el.x, startY = el.y;
    const startMx = e.clientX, startMy = e.clientY;
    const rect = canvas.getBoundingClientRect();
    const sx = cardW / rect.width, sy = cardH / rect.height;
    // Cache linked group siblings for group resize
    const isGroup = el.isLinkedGroup;
    const siblings: { id: string; dom: HTMLElement; dx: number; dy: number }[] = [];
    if (isGroup) {
      elements.filter(s => s.isLinkedGroup && s.id !== elId).forEach(s => {
        const sd = document.getElementById(`el-${s.id}`);
        if (sd) siblings.push({ id: s.id, dom: sd, dx: s.x - startX, dy: s.y - startY });
      });
    }
    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startMx) * sx, dy = (ev.clientY - startMy) * sy;
      let nw = startW, nh = startH, nx = startX, ny = startY;
      if (corner.includes('e')) nw = Math.max(20, startW + dx);
      if (corner.includes('w')) { nw = Math.max(20, startW - dx); nx = startX + startW - nw; }
      if (corner.includes('s')) nh = Math.max(20, startH + dy);
      if (corner.includes('n')) { nh = Math.max(20, startH - dy); ny = startY + startH - nh; }
      const md = document.getElementById(`el-${elId}`);
      if (md) { md.style.width = `${nw}px`; md.style.height = `${nh}px`; md.style.left = `${nx}px`; md.style.top = `${ny}px`; }
      // Move linked siblings along with position change from resize
      if (isGroup) {
        const posDx = nx - startX, posDy = ny - startY;
        for (const s of siblings) {
          s.dom.style.left = `${startX + s.dx + posDx}px`;
          s.dom.style.top = `${startY + s.dy + posDy}px`;
        }
      }
    };
    const onUp = () => {
      const md = document.getElementById(`el-${elId}`);
      if (md) {
        const fw = parseFloat(md.style.width), fh = parseFloat(md.style.height);
        const fl = parseFloat(md.style.left), ft = parseFloat(md.style.top);
        if (isGroup) {
          const posDx = fl - startX, posDy = ft - startY;
          setElements(prev => prev.map(i => {
            if (i.id === elId) return { ...i, width: fw, height: fh, x: fl, y: ft };
            const sib = siblings.find(s => s.id === i.id);
            if (sib) return { ...i, x: startX + sib.dx + posDx, y: startY + sib.dy + posDy };
            return i;
          }));
        } else {
          setElements(prev => prev.map(i => i.id === elId ? { ...i, width: fw, height: fh, x: fl, y: ft } : i));
        }
        pushHistory();
      }
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };
  const handleTextDoubleClick = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    const el = elements.find(i => i.id === elId);
    if (!el || el.isHardware) return;
    setEditingId(elId);
    // Focus the contentEditable div after React re-renders
    requestAnimationFrame(() => {
      const textDiv = document.querySelector(`#el-${elId} .editable-text`) as HTMLDivElement;
      if (textDiv) {
        textDiv.focus();
        // Select all text
        const range = document.createRange();
        range.selectNodeContents(textDiv);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  };
  const handleTextBlur = (elId: string, newContent: string) => {
    if (editingId === elId) {
      updateElement(elId, { content: newContent });
      setEditingId(null);
    }
  };
  // ---- face flip ----
  const flipCard = () => {
    const next: CardFace = activeFace === 'front' ? 'back' : 'front';
    if (flipContainerRef.current) {
      gsap.to(flipContainerRef.current, { rotateY: 90, duration: .25, ease: 'power2.in', onComplete: () => {
        setActiveFace(next); setSelectedElement(null);
        gsap.fromTo(flipContainerRef.current!, { rotateY: -90 }, { rotateY: 0, duration: .25, ease: 'power2.out' });
      }});
    } else { setActiveFace(next); setSelectedElement(null); }
  };
  const changeNetwork = (n: NetworkType) => {
    setNetwork(n); setBackElements(prev => prev.map(el => el.id === 'hw-network' ? { ...el, content: n } : el)); pushHistory();
  };
  // Rebuild back elements when orientation changes
  useEffect(() => {
    setBackElements(createBackTemplate(orientation, network));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientation]);
  // Rotate EMV chip in-place when orientation changes (keep same x,y — just rotate 90°)
  useEffect(() => {
    setFrontElements(prev => prev.map(el =>
      el.id === 'hw-chip'
        ? { ...el, rotation: orientation === 'vertical' ? 90 : 0 }
        : el
    ));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientation]);
  const handleSelectTemplate = (idx: number) => {
    const t = CARD_TEMPLATES[idx];
    setFrontBg(t.bg); setBackBg(t.backBg);
    setFrontElements(createFrontTemplate());
    setBackElements(createBackTemplate(orientation, network));
    setShowTemplateModal(false);
    pushHistory();
  };
  // ---- canvas click (F1 fix) ----
  const handleCanvasClick = () => {
    if (clickedElementRef.current) { clickedElementRef.current = false; return; }
    setSelectedElement(null);
  };
  // ---- helpers ----
  const getIconComp = (name: string) => DEFAULT_ICONS.find(i => i.name === name)?.component || Sparkles;
  const selectedData = elements.find(el => el.id === selectedElement);
  const comps = [
    { type: 'text' as const, icon: Type, label: 'Text', dv: 'Double click to edit' },
    { type: 'cardNumber' as const, icon: CreditCard, label: 'Card Number', dv: 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 1234' },
    { type: 'circle' as const, icon: Circle, label: 'Circle', dv: '' },
    { type: 'rectangle' as const, icon: Square, label: 'Rectangle', dv: '' },
    { type: 'icon' as const, icon: Sparkles, label: 'Icon', dv: '' },
    { type: 'image' as const, icon: Upload, label: 'Upload Logo', dv: '' },
  ];
  const togglePanel = (p: string) => setExpandedPanel(expandedPanel === p ? null : p);
  const ps = { background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', backdropFilter: 'blur(20px)' };
  const bs = { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)' };
  const renderHardware = (el: CardElement) => {
    if (el.imageData === 'CHIP') return <ChipSVG w={el.width} h={el.height} />;
    if (el.imageData === 'MAGSTRIPE') return <MagstripeSVG width={el.width} height={el.height} vertical={orientation === 'vertical'} />;
    if (el.imageData === 'HOLOGRAM') return <HologramSVG />;
    return null;
  };
  const resizeHandleStyle = (pos: string): React.CSSProperties => ({
    position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: '#6366f1', border: '2px solid #fff', zIndex: 100, cursor: `${pos}-resize`,
    ...(pos.includes('n') ? { top: -5 } : { bottom: -5 }),
    ...(pos.includes('w') ? { left: -5 } : { right: -5 }),
  });
  // ---- label helper for properties ----
  const PropLabel = ({ children }: { children: React.ReactNode }) => <label className="block text-xs text-slate-400 mb-1.5">{children}</label>;
  // ====================== JSX ======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#111128] to-[#0d0d20] text-white p-4 md:p-8" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input ref={clipboardInputRef} type="file" accept="image/*" multiple onChange={handleClipboardUpload} className="hidden" />

      {/* ===== TEMPLATE SELECTION MODAL ===== */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-3xl mx-4 rounded-3xl p-8" style={{ background: 'rgba(15,15,30,.95)', border: '1px solid rgba(255,255,255,.1)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Choose a Card Template</h2>
              <p className="text-sm text-slate-400 mt-2">Select a base style for your card design</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {CARD_TEMPLATES.map((t, i) => (
                <button key={t.name} onClick={() => handleSelectTemplate(i)}
                  className="group rounded-2xl p-4 transition-all hover:scale-105 hover:ring-2 hover:ring-indigo-500/50"
                  style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)' }}>
                  <div className="rounded-xl h-36 mb-4 overflow-hidden" style={{ background: t.bg, boxShadow: '0 8px 30px rgba(0,0,0,.4)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <CreditCard className="w-12 h-12 text-white/20" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{t.name}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-4">
            <button onClick={() => {
              setShowTemplateModal(false);
              setShowAIGenerator(true);
            }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-4 h-4" /> Generate with AI
            </button>
              <button onClick={() => setShowTemplateModal(false)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)' }}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    {/* ===== AI TEMPLATE GENERATOR MODAL ===== */}
    {showAIGenerator && (
      <AITemplateGenerator
        onTemplateSelect={(design) => {
          setFrontElements(design.frontElements);
          setBackElements(design.backElements);
          setFrontBg(design.frontBg);
          setBackBg(design.backBg);
          setShowAIGenerator(false);
          pushHistory();
        }}
        onClose={() => setShowAIGenerator(false)}
      />
    )}
      {/* Toast */}
      {toast && <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-right" style={{
        background: toast.type === 'warn' ? 'rgba(245,158,11,.15)' : toast.type === 'error' ? 'rgba(239,68,68,.15)' : 'rgba(99,102,241,.15)',
        border: `1px solid ${toast.type === 'warn' ? 'rgba(245,158,11,.3)' : toast.type === 'error' ? 'rgba(239,68,68,.3)' : 'rgba(99,102,241,.3)'}`,
        backdropFilter: 'blur(12px)',
      }}>
        {toast.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
        <span className="text-sm">{toast.message}</span>
        <button onClick={() => setToast(null)} className="ml-2 p-0.5 rounded hover:bg-white/10"><X className="w-3 h-3" /></button>
      </div>}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}><CreditCard className="w-5 h-5 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>Card Designer</h1>
              <p className="text-xs text-slate-500">ISO 7810 â€¢ Drag & drop your logo â€¢ Customize everything</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={historyIndex === 0} className="p-2.5 rounded-xl transition-all disabled:opacity-30 hover:bg-white/10" style={bs} title="Undo"><Undo2 className="w-4 h-4" /></button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2.5 rounded-xl transition-all disabled:opacity-30 hover:bg-white/10" style={bs} title="Redo"><Redo2 className="w-4 h-4" /></button>
            <button onClick={flipCard} className="p-2.5 rounded-xl transition-all hover:bg-white/10 ml-2 flex items-center gap-1.5" style={bs} title="Flip Card">
              <FlipHorizontal className="w-4 h-4" /><span className="text-xs hidden sm:inline">Flip</span>
            </button>
            <button onClick={() => setOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal')} className="p-2.5 rounded-xl transition-all hover:bg-white/10 flex items-center gap-1.5" style={bs} title={orientation === 'horizontal' ? 'Switch to Vertical' : 'Switch to Horizontal'}>
              <RotateCw className="w-4 h-4" /><span className="text-xs hidden sm:inline">{orientation === 'horizontal' ? 'Vertical' : 'Horizontal'}</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-3 space-y-3">

{/* ===== AI CARD GENERATOR ===== */}
<div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
  <button onClick={() => togglePanel('ai-generator')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-purple-400" />
      <span className="text-sm font-medium">AI Card Generator</span>
    </div>
    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'ai-generator' ? 'rotate-180' : ''}`} />
  </button>
  {expandedPanel === 'ai-generator' && (
    <div className="px-3 pb-3">
      <AICardGenerator
        onDesignGenerated={(design) => {
          if (activeFace === 'front') {
            setFrontElements(design.elements);
            setFrontBg(design.cardColor);
          } else {
            setBackElements(design.elements);
            setBackBg(design.cardColor);
          }
          pushHistory();
        }}
      />
    </div>
  )}
</div>

            {/* Components */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('components')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><Palette className="w-4 h-4 text-indigo-400" /><span className="text-sm font-medium">Components</span></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'components' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'components' && <div className="px-3 pb-3 space-y-1">{comps.map(c => { const I = c.icon; return (
                <button key={c.type} onClick={() => addElement(c.type, c.dv)} className="sidebar-item w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20" style={{ background: 'rgba(255,255,255,.05)' }}><I className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" /></div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{c.label}</span>
                </button>); })}</div>}
            </div>
            {/* Image Clipboard */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('clipboard')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><Clipboard className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">Image Clipboard</span>
                  {imageClipboard.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">{imageClipboard.length}</span>}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'clipboard' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'clipboard' && <div className="px-3 pb-3 space-y-2">
                <button onClick={() => clipboardInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-sm text-slate-400 hover:text-emerald-400">
                  <Plus className="w-4 h-4" /> Upload Images
                </button>
                {imageClipboard.length === 0 && <p className="text-[11px] text-slate-600 text-center py-2">Upload images to your clipboard, then click or drag them onto the card</p>}
                {imageClipboard.length > 0 && <div className="grid grid-cols-3 gap-1.5">
                  {imageClipboard.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-white/6 hover:border-emerald-500/40 transition-all cursor-grab aspect-square"
                      draggable
                      onDragStart={(e) => { e.dataTransfer.setData('text/clipboard-image', img.dataUrl); e.dataTransfer.effectAllowed = 'copy'; }}
                      onClick={() => addClipboardImageToCard(img.dataUrl)}
                      title={`${img.name} — Click to add or drag onto card`}>
                      <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" draggable={false} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFromClipboard(img.id); }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400" style={{ zIndex: 10 }}>
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>}
              </div>}
            </div>
            {/* Background + Spotlight */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('background')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-purple-400" /><span className="text-sm font-medium">{activeFace === 'front' ? 'Front' : 'Back'} Background</span></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'background' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'background' && <div className="px-3 pb-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">{GRADIENTS.map(g => (
                  <button key={g.name} onClick={() => { setCardBg(g.value); pushHistory(); }} className="h-14 rounded-xl border-2 transition-all hover:scale-105 group relative overflow-hidden"
                    style={{ background: g.value, borderColor: cardBg === g.value ? 'rgba(99,102,241,.7)' : 'rgba(255,255,255,.06)' }} title={g.name}>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/50 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{g.name}</span>
                  </button>))}</div>
                {/* Custom solid color */}
                <div className="pt-2 border-t border-white/5">
                  <PropLabel>Custom Solid Color</PropLabel>
                  <div className="flex gap-2 items-center">
                    <ColorPicker value={spotlightColor} onChange={v => setSpotlightColor(v)} className="flex-1" />
                    <button onClick={() => { setCardBg(spotlightColor); pushHistory(); }}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-purple-500/20 shrink-0" style={{ background: 'rgba(168,85,247,.1)', border: '1px solid rgba(168,85,247,.2)' }}>
                      Apply
                    </button>
                  </div>
                </div>
                {/* Spotlight gradient */}
                <div className="pt-2 border-t border-white/5">
                  <PropLabel>Spotlight Gradient</PropLabel>
                  <div className="flex gap-2 items-center">
                    <ColorPicker value={spotlightColor} onChange={v => setSpotlightColor(v)} className="w-10 shrink-0" />
                    <button onClick={() => { const g = generateSpotlightGradient(spotlightColor, spotlightX, spotlightY); setCardBg(g); pushHistory(); }}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-indigo-500/20" style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.2)' }}>
                      Apply Spotlight
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div><PropLabel>X: {spotlightX}%</PropLabel><input type="range" min="0" max="100" value={spotlightX} onChange={e => setSpotlightX(parseInt(e.target.value))} className="w-full accent-indigo-500" /></div>
                    <div><PropLabel>Y: {spotlightY}%</PropLabel><input type="range" min="0" max="100" value={spotlightY} onChange={e => setSpotlightY(parseInt(e.target.value))} className="w-full accent-indigo-500" /></div>
                  </div>
                  <div className="mt-2 h-8 rounded-lg" style={{ background: generateSpotlightGradient(spotlightColor, spotlightX, spotlightY), border: '1px solid rgba(255,255,255,.06)' }} />
                </div>
              </div>}
            </div>
            {/* Card Layout */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('layout')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><FlipHorizontal className="w-4 h-4 text-amber-400" /><span className="text-sm font-medium">{activeFace === 'front' ? 'Front' : 'Back'} Layout</span></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'layout' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'layout' && <div className="px-3 pb-3 space-y-3">
                {/* Layout preview grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {CARD_LAYOUTS.map(lay => {
                    const clip = lay.clipPath[orientation];
                    return (
                      <button key={lay.id}
                        onClick={() => {
                          setActiveLayout(prev => ({ ...prev, id: lay.id }));
                          if (lay.id !== 'none') {
                            setCardBg(activeLayout.baseColor);
                            pushHistory();
                          }
                        }}
                        className="h-14 rounded-lg border-2 transition-all relative overflow-hidden group"
                        style={{ borderColor: activeLayout.id === lay.id ? 'rgba(245,158,11,.6)' : 'rgba(255,255,255,.06)', background: lay.id === 'none' ? 'rgba(255,255,255,.03)' : activeLayout.baseColor }}>
                        {/* Overlay preview */}
                        {lay.id !== 'none' && <div className="absolute inset-0" style={{ background: activeLayout.overlayColor, clipPath: clip }} />}
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/60 font-medium opacity-0 group-hover:opacity-100 transition-opacity z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>{lay.name}</span>
                      </button>
                    );
                  })}
                </div>
                {/* Color controls — only when a layout is selected */}
                {activeLayout.id !== 'none' && <>
                  <div><PropLabel>Base Color</PropLabel><ColorPicker value={activeLayout.baseColor} onChange={v => { setActiveLayout(prev => ({ ...prev, baseColor: v })); setCardBg(v); }} /></div>
                  <div><PropLabel>Overlay Color</PropLabel><ColorPicker value={activeLayout.overlayColor} onChange={v => setActiveLayout(prev => ({ ...prev, overlayColor: v }))} /></div>
                  <button onClick={() => { setCardBg(activeLayout.baseColor); pushHistory(); }}
                    className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all hover:bg-amber-500/20" style={{ background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.2)' }}>
                    Apply Layout
                  </button>
                </>}
              </div>}
            </div>
            {/* Network */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('network')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-cyan-400" /><span className="text-sm font-medium">Card Network</span></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'network' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'network' && <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                {(['Visa','Mastercard','RuPay','Amex'] as NetworkType[]).map(n => (
                  <button key={n} onClick={() => changeNetwork(n)} className="p-3 rounded-xl border-2 transition-all flex items-center justify-center"
                    style={{ borderColor: network === n ? 'rgba(99,102,241,.6)' : 'rgba(255,255,255,.06)', background: network === n ? 'rgba(99,102,241,.08)' : 'transparent' }}>
                    <NetworkLogo type={n} size={20} />
                  </button>))}
              </div>}
            </div>
            {/* Patterns */}
            <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}>
              <button onClick={() => togglePanel('patterns')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-rose-400" /><span className="text-sm font-medium">{activeFace === 'front' ? 'Front' : 'Back'} Pattern</span></div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedPanel === 'patterns' ? 'rotate-180' : ''}`} />
              </button>
              {expandedPanel === 'patterns' && <div className="px-3 pb-3 space-y-3">
                {/* Pattern grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {/* None option */}
                  <button onClick={() => setActivePattern(p => ({ ...p, id: null }))}
                    className="h-12 rounded-lg border-2 transition-all flex items-center justify-center text-[10px] text-slate-500"
                    style={{ borderColor: activePattern.id === null ? 'rgba(244,63,94,.6)' : 'rgba(255,255,255,.06)', background: activePattern.id === null ? 'rgba(244,63,94,.08)' : 'rgba(255,255,255,.03)' }}>
                    None
                  </button>
                  {CARD_PATTERNS.map(p => {
                    const previewSvg = p.svg('#888888', 0.5);
                    const encoded = `url("data:image/svg+xml,${encodeURIComponent(previewSvg)}")`;
                    return (
                      <button key={p.id} onClick={() => setActivePattern(prev => ({ ...prev, id: p.id }))}
                        className="h-12 rounded-lg border-2 transition-all overflow-hidden"
                        style={{ borderColor: activePattern.id === p.id ? 'rgba(244,63,94,.6)' : 'rgba(255,255,255,.06)', backgroundImage: encoded, backgroundSize: 'auto', backgroundColor: 'rgba(255,255,255,.03)' }}
                        title={p.name} />
                    );
                  })}
                </div>
                {/* Customization controls */}
                {activePattern.id && <>
                  <div><PropLabel>Pattern Color</PropLabel><ColorPicker value={activePattern.color} onChange={v => setActivePattern(p => ({ ...p, color: v }))} /></div>
                  <div><PropLabel>Opacity: {(activePattern.opacity*100).toFixed(0)}%</PropLabel><input type="range" min="0.01" max="0.3" step="0.01" value={activePattern.opacity} onChange={e => setActivePattern(p => ({ ...p, opacity: parseFloat(e.target.value) }))} className="w-full accent-rose-500" /></div>
                  <div><PropLabel>Scale: {activePattern.scale.toFixed(1)}x</PropLabel><input type="range" min="0.3" max="3" step="0.1" value={activePattern.scale} onChange={e => setActivePattern(p => ({ ...p, scale: parseFloat(e.target.value) }))} className="w-full accent-rose-500" /></div>
                </>}
              </div>}
            </div>
            {/* Properties — ENHANCED */}
            {selectedData && <div className="rounded-2xl overflow-hidden sidebar-item" style={ps}><div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Properties
                  {selectedData.isHardware && <span className="text-[10px] text-amber-400 ml-1">FIXED</span>}
                  {selectedData.isPositionLocked && <span className="text-[10px] text-cyan-400 ml-1">POS LOCKED</span>}
                </span>
                {!selectedData.isHardware && !selectedData.isPositionLocked && <button onClick={() => deleteElement(selectedElement!)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
              </div>
              {selectedData.isHardware && <p className="text-[11px] text-slate-500">Hardware element — fully locked</p>}
              {!selectedData.isHardware && <div className="space-y-3">
                {/* Position sliders — hidden for position-locked elements */}
                {!selectedData.isPositionLocked && <div className="grid grid-cols-2 gap-2">
                  <div><PropLabel>X: {Math.round(selectedData.x)}</PropLabel><input type="range" min="0" max={CARD.W} value={selectedData.x} onChange={e => updateElement(selectedElement!, { x: parseFloat(e.target.value) })} className="w-full accent-indigo-500" /></div>
                  <div><PropLabel>Y: {Math.round(selectedData.y)}</PropLabel><input type="range" min="0" max={CARD.H} value={selectedData.y} onChange={e => updateElement(selectedElement!, { y: parseFloat(e.target.value) })} className="w-full accent-indigo-500" /></div>
                </div>}
                {/* Size sliders — always shown */}
                <div className="grid grid-cols-2 gap-2">
                  <div><PropLabel>W: {Math.round(selectedData.width)}</PropLabel><input type="range" min="20" max="400" value={selectedData.width} onChange={e => updateElement(selectedElement!, { width: parseInt(e.target.value) })} className="w-full accent-indigo-500" /></div>
                  <div><PropLabel>H: {Math.round(selectedData.height)}</PropLabel><input type="range" min="20" max="260" value={selectedData.height} onChange={e => updateElement(selectedElement!, { height: parseInt(e.target.value) })} className="w-full accent-indigo-500" /></div>
                </div>
                <div><PropLabel>Rotation: {selectedData.rotation}Â°</PropLabel><input type="range" min="0" max="360" value={selectedData.rotation} onChange={e => updateElement(selectedElement!, { rotation: parseInt(e.target.value) })} className="w-full accent-indigo-500" /></div>
                <div><PropLabel>Opacity: {(selectedData.opacity*100).toFixed(0)}%</PropLabel><input type="range" min="0" max="1" step=".05" value={selectedData.opacity} onChange={e => updateElement(selectedElement!, { opacity: parseFloat(e.target.value) })} className="w-full accent-indigo-500" /></div>
                {/* Text / CardNumber */}
                {(selectedData.type === 'text' || selectedData.type === 'cardNumber') && <>
                  <div><PropLabel>Text Color</PropLabel><ColorPicker value={selectedData.color} onChange={v => updateElement(selectedElement!, { color: v })} /></div>
                  <div><PropLabel>Font Size: {selectedData.fontSize}px</PropLabel><input type="range" min="6" max="48" value={selectedData.fontSize} onChange={e => updateElement(selectedElement!, { fontSize: parseInt(e.target.value) })} className="w-full accent-indigo-500" /></div>
                  <div><PropLabel>Font Family</PropLabel><select value={selectedData.fontFamily || "'Inter',sans-serif"} onChange={e => updateElement(selectedElement!, { fontFamily: e.target.value })} className="w-full bg-white/5 rounded-lg p-2 text-xs border border-white/10 text-white">
                    {FONT_FAMILIES.map(f => <option key={f.name} value={f.value} className="bg-[#1a1a2e]">{f.name}</option>)}
                  </select></div>
                  <div><PropLabel>Font Weight</PropLabel><select value={selectedData.fontWeight || 400} onChange={e => updateElement(selectedElement!, { fontWeight: parseInt(e.target.value) })} className="w-full bg-white/5 rounded-lg p-2 text-xs border border-white/10 text-white">
                    {[300,400,500,600,700].map(w => <option key={w} value={w} className="bg-[#1a1a2e]">{w === 300 ? 'Light' : w === 400 ? 'Regular' : w === 500 ? 'Medium' : w === 600 ? 'Semi-Bold' : 'Bold'}</option>)}
                  </select></div>
                  <div><PropLabel>Letter Spacing: {selectedData.letterSpacing ?? 0}px</PropLabel><input type="range" min="0" max="10" step=".5" value={selectedData.letterSpacing ?? 0} onChange={e => updateElement(selectedElement!, { letterSpacing: parseFloat(e.target.value) })} className="w-full accent-indigo-500" /></div>
                </>}
                {/* Icon */}
                {selectedData.type === 'icon' && <>
                  <div><PropLabel>Icon</PropLabel><div className="grid grid-cols-4 gap-1.5">{DEFAULT_ICONS.map(ic => { const IC = ic.component; return (
                    <button key={ic.name} onClick={() => updateElement(selectedElement!, { iconName: ic.name })} className="p-2 rounded-lg border transition-all"
                      style={{ borderColor: selectedData.iconName === ic.name ? 'rgba(99,102,241,.6)' : 'rgba(255,255,255,.06)', background: selectedData.iconName === ic.name ? 'rgba(99,102,241,.1)' : 'transparent' }}>
                      <IC className="w-4 h-4 mx-auto text-slate-300" /></button>); })}</div></div>
                  <div><PropLabel>Color</PropLabel><ColorPicker value={selectedData.color} onChange={v => updateElement(selectedElement!, { color: v })} /></div>
                </>}
                {/* Image */}
                {selectedData.type === 'image' && <>
                  <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <span className="text-xs text-slate-400">Remove Background</span>
                    <button onClick={() => toggleBgRemoval(selectedElement!)} className="relative w-10 h-5 rounded-full transition-colors" style={{ background: selectedData.isBackgroundRemoved ? '#6366f1' : 'rgba(255,255,255,.1)' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" style={{ left: selectedData.isBackgroundRemoved ? 22 : 2 }} />
                    </button>
                  </div>
                  {/* Background removal sliders — integrated from backgroundslider.html */}
                  <div className="space-y-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div>
                      <PropLabel>Tolerance - Color Sensitivity: {bgRemovalTolerance.toFixed(2)}</PropLabel>
                      <input type="range" min="0" max="0.5" step="0.01" value={bgRemovalTolerance} onChange={e => { const v = parseFloat(e.target.value); setBgRemovalTolerance(v); reapplyBgRemoval(v, bgRemovalFade, bgRemovalKeepInternal); }} className="w-full accent-indigo-500" />
                    </div>
                    <div>
                      <PropLabel>Fade - Edge Smoothness: {bgRemovalFade.toFixed(2)}</PropLabel>
                      <input type="range" min="0" max="0.5" step="0.01" value={bgRemovalFade} onChange={e => { const v = parseFloat(e.target.value); setBgRemovalFade(v); reapplyBgRemoval(bgRemovalTolerance, v, bgRemovalKeepInternal); }} className="w-full accent-indigo-500" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={bgRemovalKeepInternal} onChange={e => { const v = e.target.checked; setBgRemovalKeepInternal(v); reapplyBgRemoval(bgRemovalTolerance, bgRemovalFade, v); }} className="w-4 h-4 rounded accent-indigo-500" />
                      <span className="text-xs text-slate-400">Keep Internal Pixels</span>
                    </label>
                  </div>
                </>}
                {/* Shapes */}
                {(selectedData.type === 'circle' || selectedData.type === 'rectangle') && <>
                  <div><PropLabel>Fill Color</PropLabel><ColorPicker value={selectedData.backgroundColor} onChange={v => updateElement(selectedElement!, { backgroundColor: v })} /></div>
                </>}
              </div>}
            </div></div>}
          </div>
          {/* ===== CANVAS ===== */}
          <div ref={canvasWrapperRef} className="lg:col-span-9" style={{ willChange: 'transform' }}>
            <div className="rounded-2xl p-6 md:p-10 transition-colors duration-300" style={{
              backgroundColor: canvasLightMode ? '#ffffff' : '#09090b',
              backgroundImage: canvasLightMode
                ? 'radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px)'
                : 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              border: canvasLightMode ? '1px solid rgba(0,0,0,.08)' : '1px solid rgba(255,255,255,.04)'
            }}>
              <div className="flex items-center justify-center gap-2 mb-6">
                {(['front','back'] as CardFace[]).map(f => (
                  <button key={f} onClick={() => { if (f !== activeFace) flipCard(); }}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: activeFace === f ? 'rgba(99,102,241,.15)' : 'transparent', color: activeFace === f ? '#818cf8' : '#64748b', border: activeFace === f ? '1px solid rgba(99,102,241,.3)' : '1px solid transparent' }}>
                    {f === 'front' ? 'Front Face' : 'Back Face'}
                  </button>))}
                <button onClick={(e) => { e.stopPropagation(); const next = !syncFaces; setSyncFaces(next); setToast({ message: next ? 'Sync ON — back mirrors front styles' : 'Sync OFF — faces are independent', type: 'info' }); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ml-1"
                  style={{ background: syncFaces ? 'rgba(34,197,94,.12)' : 'rgba(255,255,255,.03)', border: syncFaces ? '1px solid rgba(34,197,94,.3)' : '1px solid rgba(255,255,255,.06)', color: syncFaces ? '#4ade80' : '#64748b' }}
                  title={syncFaces ? 'Front → Back sync ON: back face mirrors front styles' : 'Sync styles from front to back face'}>
                  {syncFaces ? <Link2 className="w-3 h-3" /> : <Unlink2 className="w-3 h-3" />}
                  {syncFaces ? 'Synced' : 'Sync'}
                </button>
                <span className={`text-[10px] ml-2 ${canvasLightMode ? 'text-slate-400' : 'text-slate-600'}`}>ISO 7810 ID-1 • {orientation === 'horizontal' ? '85.60 × 53.98' : '53.98 × 85.60'} mm</span>
                <button onClick={() => setCanvasLightMode(p => !p)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ml-auto"
                  style={{ background: canvasLightMode ? 'rgba(250,204,21,.12)' : 'rgba(255,255,255,.03)', border: canvasLightMode ? '1px solid rgba(250,204,21,.3)' : '1px solid rgba(255,255,255,.06)', color: canvasLightMode ? '#facc15' : '#64748b' }}
                  title={canvasLightMode ? 'Switch to dark canvas' : 'Switch to light canvas'}>
                  {canvasLightMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  {canvasLightMode ? 'Light' : 'Dark'}
                </button>
              </div>
              <div className="flex justify-center items-center" style={{ minHeight: 380, perspective: 1200 }}>
                <div ref={flipContainerRef} style={{ transformStyle: 'preserve-3d' }}
                  onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleFileDrop}>
                  <div ref={canvasRef} onClick={handleCanvasClick}
                    className="relative overflow-hidden"
                    style={{ width: cardW, height: cardH, background: cardBg, borderRadius: CARD.R,
                      transition: 'width 0.4s ease, height 0.4s ease, box-shadow 0.3s ease, border 0.3s ease',
                      boxShadow: isDragOver ? '0 0 40px rgba(99,102,241,.5),0 25px 60px rgba(0,0,0,.4)' : '0 25px 60px rgba(0,0,0,.4)',
                      border: isDragOver ? '2px dashed rgba(99,102,241,.6)' : '1px solid rgba(255,255,255,.08)' }}>
                    <div className="absolute pointer-events-none" style={{ inset: CARD.MARGIN, border: '1px dashed rgba(255,255,255,.06)', borderRadius: CARD.R - 4 }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ opacity: .04 }}><svg width="100%" height="100%"><pattern id="cp" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#cp)"/></svg></div>
                    <div className="absolute pointer-events-none" style={{ width: 200, height: 200, right: -60, top: -60, background: 'radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%)', borderRadius: '50%' }} />
                    {/* Pattern overlay */}
                    {activePattern.id && (() => {
                      const pat = CARD_PATTERNS.find(p => p.id === activePattern.id);
                      if (!pat) return null;
                      const svgStr = pat.svg(activePattern.color, activePattern.scale);
                      const encoded = `url("data:image/svg+xml,${encodeURIComponent(svgStr)}")`;
                      return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: encoded, backgroundRepeat: 'repeat', opacity: activePattern.opacity, borderRadius: CARD.R }} />;
                    })()}
                    {/* Layout overlay */}
                    {activeLayout.id !== 'none' && (() => {
                      const lay = CARD_LAYOUTS.find(l => l.id === activeLayout.id);
                      if (!lay) return null;
                      return <div className="absolute inset-0 pointer-events-none" style={{ background: activeLayout.overlayColor, clipPath: lay.clipPath[orientation], borderRadius: CARD.R }} />;
                    })()}
                    <div id="collision-warn" className="absolute top-2 left-1/2 -translate-x-1/2 z-[100] items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] text-amber-300" style={{ display: 'none', background: 'rgba(245,158,11,.15)', border: '1px solid rgba(245,158,11,.3)', backdropFilter: 'blur(8px)' }} />
                    {isDragOver && <div className="absolute inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(99,102,241,.1)', backdropFilter: 'blur(2px)' }}>
                      <div className="text-center"><Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-bounce" /><p className="text-sm text-indigo-300 font-medium">Drop your logo</p></div>
                    </div>}
                    {elements.map(el => (
                      <div key={el.id} id={`el-${el.id}`}
                        onMouseDown={e => handleElementMouseDown(e, el.id)}
                        onDoubleClick={e => { if (el.type === 'text' || el.type === 'cardNumber') handleTextDoubleClick(e, el.id); }}
                        className={`card-element absolute select-none ${selectedElement === el.id && !el.isHardware ? 'ring-1 ring-indigo-400/60' : ''}`}
                        style={{ left: el.x, top: el.y, width: el.width, height: el.height,
                          cursor: el.isHardware ? 'default' : el.isPositionLocked ? 'pointer' : 'grab',
                          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                          zIndex: el.isHardware ? 60 : selectedElement === el.id ? 50 : 1 }}>
                        {/* Inline delete button — not for hardware or position-locked */}
                        {selectedElement === el.id && !el.isHardware && !el.isPositionLocked && (
                          <button onMouseDown={e => { e.stopPropagation(); clickedElementRef.current = true; deleteElement(el.id); }}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-400 transition-colors" style={{ zIndex: 110 }}>
                            <X className="w-3 h-3 text-white" />
                          </button>
                        )}
                        {/* Resize handles — shown for non-hardware (including position-locked) */}
                        {selectedElement === el.id && !el.isHardware && <>
                          <div onMouseDown={e => handleResizeMouseDown(e, el.id, 'se')} style={resizeHandleStyle('se')} />
                          <div onMouseDown={e => handleResizeMouseDown(e, el.id, 'sw')} style={resizeHandleStyle('sw')} />
                          <div onMouseDown={e => handleResizeMouseDown(e, el.id, 'ne')} style={resizeHandleStyle('ne')} />
                          <div onMouseDown={e => handleResizeMouseDown(e, el.id, 'nw')} style={resizeHandleStyle('nw')} />
                        </>}
                        {(el.type === 'text' || el.type === 'cardNumber') && el.id !== 'hw-network' && (
                          <div className="editable-text w-full h-full flex items-center"
                            contentEditable={editingId === el.id}
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextBlur(el.id, (e.target as HTMLDivElement).innerText)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); (e.target as HTMLDivElement).blur(); }
                              if (e.key === 'Escape') { setEditingId(null); }
                            }}
                            onMouseDown={(e) => { if (editingId === el.id) e.stopPropagation(); }}
                            style={{ color: el.color, fontSize: el.fontSize,
                              fontFamily: el.fontFamily || (el.type === 'cardNumber' ? "'Courier New',monospace" : "'Inter',sans-serif"),
                              fontWeight: el.fontWeight || (el.type === 'cardNumber' ? 500 : 400),
                              letterSpacing: el.letterSpacing ?? 0, opacity: el.opacity,
                              whiteSpace: el.content?.includes('\n') ? 'pre-line' : 'nowrap',
                              lineHeight: el.content?.includes('\n') ? 1.4 : undefined,
                              alignItems: 'flex-start',
                              outline: editingId === el.id ? '1px solid rgba(99,102,241,.5)' : 'none',
                              borderRadius: editingId === el.id ? 4 : 0,
                              cursor: editingId === el.id ? 'text' : undefined,
                              minWidth: 20 }}>{el.content}</div>)}
                        {el.type === 'text' && el.id === 'hw-network' && <NetworkLogo type={el.content as NetworkType} size={28} />}
                        {el.type === 'icon' && (() => { const IC = getIconComp(el.iconName || 'Sparkles'); return <IC className="w-full h-full" style={{ color: el.color, opacity: el.opacity }} />; })()}
                        {el.type === 'image' && el.isHardware && renderHardware(el)}
                        {el.type === 'image' && !el.isHardware && el.imageData && (
                          <img src={el.imageData} alt="Logo" className="w-full h-full object-contain rounded" style={{ opacity: el.opacity }} draggable={false} />)}
                        {el.type === 'circle' && <div className="w-full h-full rounded-full" style={{ backgroundColor: el.backgroundColor, opacity: el.opacity }} />}
                        {el.type === 'rectangle' && <div className="w-full h-full rounded-lg" style={{ backgroundColor: el.backgroundColor, opacity: el.opacity }} />}
                      </div>))}
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center"><p className="text-[11px] text-slate-600">
                Click to select â€¢ Drag to move â€¢ Double-click text to edit â€¢ Drop images from desktop â€¢ <span className="text-slate-500 font-medium">{activeFace === 'front' ? 'Front' : 'Back'} Face</span>
              </p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
