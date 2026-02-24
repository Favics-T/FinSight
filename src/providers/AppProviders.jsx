import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from '../context/SearchContext';
import { DataProvider } from '../context/DataContext';
import { ToggleProvider } from '../context/ToggleContext';
import { WatchlistProvider } from '../context/WatchListContext';
import SideBarProvider from '../context/SideBarContext';
import { TimeframeProvider } from '../context/TimeframeContext';
import { ThemeStoreProvider } from '../store/theme-store';
import { UIStoreProvider } from '../store/ui-store';
import { ToastStoreProvider } from '../store/toast-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default AppProviders;
