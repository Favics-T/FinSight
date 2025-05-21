import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ToggleProvider } from './context/ToggleContext.jsx'

createRoot(document.getElementById('root')).render(
 
 
  <StrictMode>
    <ToggleProvider>
     <SearchProvider>
      <DataProvider>
    <App />
    </DataProvider>
    </SearchProvider>
    </ToggleProvider>
  </StrictMode>,
)
