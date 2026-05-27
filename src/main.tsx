import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppMotionProvider } from './components/Motion'
import { ThemeProvider } from './components/ThemeProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AppMotionProvider>
          <App />
        </AppMotionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
