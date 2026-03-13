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

  // Always start in dark mode
  useEffect(() => {
    setMounted(true);
  }, []);

  // Persist to localStorage and sync Tailwind dark class
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('blazeup-light-mode', String(light));
    } catch {}
    // Toggle the Tailwind `dark` class on <html> for components using dark: utilities
    const root = document.documentElement;
    if (light) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [light, mounted]);

  const toggleLight = React.useCallback(() => setLight(v => !v), []);

  return (
    <ThemeContext.Provider value={{ light, toggleLight }}>
      {children}
    </ThemeContext.Provider>
  );
}
