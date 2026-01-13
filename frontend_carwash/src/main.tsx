// src/main.tsx (อย่าลืมเปลี่ยนชื่อไฟล์เป็น main.tsx)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// ลบ .js ออก เพราะเราเปลี่ยนไฟล์ปลายทางเป็น .tsx แล้ว
import App from './App' 
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'; 

// จุดสำคัญ: ใส่เครื่องหมายตกใจ (!) หลัง getElementById
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)