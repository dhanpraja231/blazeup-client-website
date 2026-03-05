'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextValue {
  light: boolean;
  toggleLight: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ light: false, toggleLight: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('blazeup-light-mode');
      if (stored === 'true') setLight(true);
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('blazeup-light-mode', String(light));
    } catch {}
  }, [light, mounted]);

  const toggleLight = React.useCallback(() => setLight(v => !v), []);

  return (
    <ThemeContext.Provider value={{ light, toggleLight }}>
      {children}
    </ThemeContext.Provider>
  );
}
