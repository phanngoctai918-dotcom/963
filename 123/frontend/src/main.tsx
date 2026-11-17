import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SWRConfig } from 'swr'
import { BrowserRouter } from 'react-router-dom'
import AppearanceProvider from './app/AppearanceProvider'
import App from './app/App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppearanceProvider>
      <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 1 }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SWRConfig>
    </AppearanceProvider>
  </StrictMode>,
)
