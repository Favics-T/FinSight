import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ToggleProvider } from './context/ToggleContext.jsx'
import './chartSetup.js'
import { WatchlistProvider } from './context/WatchListContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import SideBarProvider from './context/SideBarContext.jsx'
import { CryptoMarketProvider } from './context/CryptoMarketContext.jsx'



createRoot(document.getElementById('root')).render(
 
 
  <StrictMode>
    <SideBarProvider>
    <ThemeProvider>
    <WatchlistProvider>
    <ToggleProvider>
     <SearchProvider>
      <DataProvider>
        <CryptoMarketProvider>
    <App />
    </CryptoMarketProvider>
    </DataProvider>
    </SearchProvider>
    </ToggleProvider>
    </WatchlistProvider>
    </ThemeProvider>
    </SideBarProvider>
  </StrictMode>,
)
