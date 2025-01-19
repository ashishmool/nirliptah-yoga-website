import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ThemeProvider} from "@/pages/components/theme-provider.tsx";
import {LoginModalProvider} from "@/context/LoginModalContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider>
          <LoginModalProvider>
             <App />
          </LoginModalProvider>
      </ThemeProvider>
  </React.StrictMode>,
)
