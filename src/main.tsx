import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from '@src/store'
import { ToastProvider } from './components/Toast'
import { ConfirmToastProvider } from './components/ConfirmToast'
import { DarkModeProvider } from './contexts/DarkModeContext'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <DarkModeProvider>
        <ToastProvider>
          <ConfirmToastProvider>
            <App />
          </ConfirmToastProvider>
        </ToastProvider>
      </DarkModeProvider>
    </Provider>
  // {/* </StrictMode>, */}
)
