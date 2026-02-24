import React from 'react';
import { MdOutlineMenu } from 'react-icons/md';
import { useUIStore } from '../../store/ui-store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export function AppHeader() {
  const { toggleSidebar } = useUIStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-[64px] glass border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button className="md:hidden" onClick={toggleSidebar} aria-label="Open sidebar">
          <MdOutlineMenu className="text-2xl" />
        </button>
        <div>
          <h2 className="font-semibold">Market Command Center</h2>
          <p className="text-xs text-muted">Real-time crypto and stock insights</p>
        </div>
      </div>

      <Button variant="secondary" size="sm" onClick={toggleTheme}>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </Button>
    </header>
  );
}

export default AppHeader;
