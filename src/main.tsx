import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context.tsx'
import { AuthProvider } from './auth/AuthContext'
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <ShopContextProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ShopContextProvider>
    </BrowserRouter>
)
