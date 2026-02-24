import React from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { ToastViewport } from '../ui/Toast';
import MarketToolbar from './MarketToolbar';

export function AppLayout() {
  return (
    <div className="min-h-screen app-shell">
      <AppHeader />
      <AppSidebar />

      <main className="md:ml-[19rem] p-4 md:p-8 pt-[76px] md:pt-[88px] page-enter">
        <MarketToolbar />
        <Outlet />
      </main>

      <ToastViewport />
    </div>
  );
}

export default AppLayout;
