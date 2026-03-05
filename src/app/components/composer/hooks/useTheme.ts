import { useTheme as useGlobalTheme } from '@/components/ThemeProvider';
import type { Theme } from '../types/flow';

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const { light, toggleLight } = useGlobalTheme();
  return {
    theme: light ? 'light' : 'dark',
    toggleTheme: toggleLight,
  };
}

