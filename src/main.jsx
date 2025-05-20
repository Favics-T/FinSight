import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { DataProvider } from './context/DataContext.jsx'

createRoot(document.getElementById('root')).render(
 
 
  <StrictMode>
     <SearchProvider>
      <DataProvider>
    <App />
    </DataProvider>
    </SearchProvider>
  </StrictMode>,
)
