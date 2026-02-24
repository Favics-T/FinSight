import React from 'react';
import { SearchProvider } from '../context/SearchContext';
import { DataProvider } from '../context/DataContext';
import { ToggleProvider } from '../context/ToggleContext';
import { WatchlistProvider } from '../context/WatchListContext';
import SideBarProvider from '../context/SideBarContext';
import { TimeframeProvider } from '../context/TimeframeContext';
import { ThemeStoreProvider } from '../store/theme-store';
import { UIStoreProvider } from '../store/ui-store';
import { ToastStoreProvider } from '../store/toast-store';

export function AppProviders({ children }) {
  return (
    <ThemeStoreProvider>
      <ToastStoreProvider>
        <UIStoreProvider>
          <SideBarProvider>
            <WatchlistProvider>
              <ToggleProvider>
                <SearchProvider>
                  <DataProvider>
                    <TimeframeProvider>{children}</TimeframeProvider>
                  </DataProvider>
                </SearchProvider>
              </ToggleProvider>
            </WatchlistProvider>
          </SideBarProvider>
        </UIStoreProvider>
      </ToastStoreProvider>
    </ThemeStoreProvider>
  );
}

export default AppProviders;
