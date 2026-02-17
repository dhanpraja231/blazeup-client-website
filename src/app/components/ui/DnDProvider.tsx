'use client';

import { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

// Auto-detect touch support
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

export function MultiBackendDnDProvider({ children }: { children: ReactNode }) {
  const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;
  const backendOptions = isTouchDevice() 
    ? { 
        enableMouseEvents: true,
        delayTouchStart: 200,
        touchSlop: 5
      } 
    : {};

  return (
    <DndProvider backend={backendForDND} options={backendOptions}>
      {children}
    </DndProvider>
  );
}
