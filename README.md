# FinSight

A modern crypto + stock dashboard built with React and Vite, now organized with a clean architecture foundation.

## Architecture

The project is now structured around explicit layers:

```text
src/
  components/
    boundaries/
      AppSuspense.jsx
      ErrorBoundary.jsx
    layout/
      AppHeader.jsx
      AppLayout.jsx
      AppSidebar.jsx
    ui/
      Button.jsx
      Card.jsx
      Skeleton.jsx
      Table.jsx
      Toast.jsx

  features/
    dashboard/pages/DashboardPage.jsx
    crypto/pages/CryptoDashboardPage.jsx
    stocks/pages/StockDashboardPage.jsx
    mock/pages/MockDataPage.jsx

  hooks/
    useTheme.js
    useToast.js

  lib/
    fetchClient.js

  providers/
    AppProviders.jsx

  services/
    crypto.service.js
    stock.service.js
    mockData.service.js

  store/
    theme-store.jsx
    toast-store.jsx
    ui-store.jsx

  types/
    api.js

  App.jsx
  main.jsx
```

## What Was Implemented

- Theme provider (dark/light):
  - `src/store/theme-store.jsx`
  - `src/hooks/useTheme.js`
- Layout system with sidebar + header:
  - `src/components/layout/AppLayout.jsx`
  - `src/components/layout/AppSidebar.jsx`
  - `src/components/layout/AppHeader.jsx`
- Reusable primitives:
  - `src/components/ui/Button.jsx`
  - `src/components/ui/Card.jsx`
  - `src/components/ui/Table.jsx`
  - `src/components/ui/Skeleton.jsx`
- Toast system:
  - `src/store/toast-store.jsx`
  - `src/components/ui/Toast.jsx`
  - `src/hooks/useToast.js`
- Error boundary + suspense boundary:
  - `src/components/boundaries/ErrorBoundary.jsx`
  - `src/components/boundaries/AppSuspense.jsx`
- Type-safe API service layer (runtime parsing + typed JSDoc models):
  - `src/types/api.js`
  - `src/services/crypto.service.js`
  - `src/services/stock.service.js`
- Centralized fetch client:
  - `src/lib/fetchClient.js`
- Example mock data service:
  - `src/services/mockData.service.js`
  - `src/features/mock/pages/MockDataPage.jsx`

## Routing

Core routes now use lazy loading + suspense in `src/App.jsx`:

- `/dashboard` - overview dashboard (cards + tables)
- `/crypto` - crypto dashboard
- `/stocks` - stock dashboard
- `/mock` - mock service demo page

Backwards compatibility redirects are also included for old paths (`/cryptodashboard`, `/stockdashboard`, etc.).

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add env file:

```bash
# .env
VITE_ALPHA_VANTAGE_API_KEY=your_key_here
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Linting

```bash
npm run lint
```

The project uses a centralized ESLint config in `eslint.config.js` with React hooks and refresh rules.

## Notes

- Alpha Vantage free tier is rate-limited; stock quote aggregation intentionally runs sequentially.
- CoinGecko powers crypto market and chart data.
- Existing legacy pages remain available and are integrated through the new app shell.
