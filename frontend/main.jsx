import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Design system for the landing / dashboard / timeline / settings pages.
// Imported first so the scoped rules in ./index.css layer on top.
import './src/index.css'
import './index.css'
import { getInitialTheme, applyTheme } from './src/utils/theme.js'
import App from './App.jsx'

// Initialize user theme preference
applyTheme(getInitialTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
