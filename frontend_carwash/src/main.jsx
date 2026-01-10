import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>      {/* 1. เปิด Router (กล่องใหญ่สุด) */}
      <AuthProvider>     {/* 2. เปิด Auth (กล่องรองลงมา) */}
        <App />          {/* 3. เนื้อหาแอพ */}
      </AuthProvider>    {/* 2. ปิด Auth */}
    </BrowserRouter>     {/* 1. ปิด Router */}
  </StrictMode>,
)