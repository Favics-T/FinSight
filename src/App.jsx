import React, { lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/boundaries/ErrorBoundary';
import AppSuspense from './components/boundaries/AppSuspense';

const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const CryptoDashboardPage = lazy(() => import('./features/crypto/pages/CryptoDashboardPage'));
const StockDashboardPage = lazy(() => import('./features/stocks/pages/StockDashboardPage'));
const MockDataPage = lazy(() => import('./features/mock/pages/MockDataPage'));

const CryptoDetail = lazy(() => import('./pages/CryptoDetail'));
const StockDetail = lazy(() => import('./pages/StockDetail'));
const CryptoList = lazy(() => import('./pages/CryptoList'));
const WatchList = lazy(() => import('./pages/WatchList'));

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AppSuspense>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="crypto" element={<CryptoDashboardPage />} />
              <Route path="stocks" element={<StockDashboardPage />} />
              <Route path="mock" element={<MockDataPage />} />

              <Route path="cryptolist" element={<CryptoList />} />
              <Route path="watchlist" element={<WatchList />} />
              <Route path="crypto/:id" element={<CryptoDetail />} />
              <Route path="stock/:symbol" element={<StockDetail />} />

              {/* Backwards compatibility routes */}
              <Route path="cryptodashboard" element={<Navigate to="/crypto" replace />} />
              <Route path="stockdashboard" element={<Navigate to="/stocks" replace />} />
              <Route path="market" element={<Navigate to="/dashboard" replace />} />
              <Route path="home" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AppSuspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
