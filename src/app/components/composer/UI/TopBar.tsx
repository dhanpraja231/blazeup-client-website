import { CreditCard, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import type { Theme } from '../types/flow';
import { useUIStore } from '../store/uiStore';

interface TopBarProps {
  title?: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function TopBar({ title = 'Credit Card Policy Playground', theme, onToggleTheme }: TopBarProps) {
  const toggleSidePanel = useUIStore((state) => state.toggleSidePanel);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-gray-50 dark:bg-gray-900 backdrop-blur-md border-b border-gray-300 dark:border-gray-700 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidePanel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle side panel"
          >
            <Menu className="w-5 h-5 text-gray-800 dark:text-gray-50" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-base font-bold text-gray-800 dark:text-gray-50">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}
