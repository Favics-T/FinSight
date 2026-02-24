import { createContext, useContext, useMemo, useState } from 'react';

const UIStore = createContext(null);

export function UIStoreProvider({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar: () => setSidebarOpen(true),
      closeSidebar: () => setSidebarOpen(false),
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
    }),
    [isSidebarOpen]
  );

  return <UIStore.Provider value={value}>{children}</UIStore.Provider>;
}

export function useUIStore() {
  const ctx = useContext(UIStore);
  if (!ctx) throw new Error('useUIStore must be used within UIStoreProvider');
  return ctx;
}
