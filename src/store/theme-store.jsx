import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeStore = createContext(null);

export function ThemeStoreProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);
  return <ThemeStore.Provider value={value}>{children}</ThemeStore.Provider>;
}

export function useThemeStore() {
  const ctx = useContext(ThemeStore);
  if (!ctx) throw new Error('useThemeStore must be used within ThemeStoreProvider');
  return ctx;
}
