import React from 'react';
import { MdOutlineMenu } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import { useUIStore } from '../../store/ui-store';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';
import SearchBar from '../SearchBar';

export function AppHeader() {
  const { toggleSidebar } = useUIStore();
  const { theme, toggleTheme } = useTheme();
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-[64px] glass border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button className="md:hidden" onClick={toggleSidebar} aria-label="Open sidebar">
          <MdOutlineMenu className="text-2xl" />
        </button>
        <div className="min-w-0">
          <h2 className="font-semibold">Market Command Center</h2>
          <p className="text-xs text-muted">Real-time crypto and stock insights</p>
        </div>
      </div>

      <div className="hidden md:block flex-1 max-w-md">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="md:hidden h-9 w-9 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center"
          onClick={() => setShowMobileSearch((prev) => !prev)}
          aria-label="Toggle search"
        >
          <CiSearch className="text-lg" />
        </button>
        <Button variant="secondary" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
      </div>

      {showMobileSearch ? (
        <div className="absolute top-[64px] left-0 right-0 px-3 py-2 md:hidden glass border-b border-white/10">
          <SearchBar />
        </div>
      ) : null}
    </header>
  );
}

export default AppHeader;
