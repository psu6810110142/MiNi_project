// src/App.tsx

import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import Login from './pages/Loginpage'; 
import Register from './pages/Register';
import Booking from './pages/Booking';
import HistoryPage from './pages/History'; 
import AdminDashboard from './pages/AdminDashboard'; 
import './App.css';
// ✅ เช็คให้ชัวร์ว่าชื่อไฟล์คือ interfaces.ts (มี s) หรือ interface.ts (ไม่มี s) 
// ถ้าคุณตั้งชื่อว่า interfaces.ts ให้แก้บรรทัดนี้เป็น './interfaces'
import { User } from './interface'; 

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUser({ 
        id: 0, 
        username: savedUsername, 
        role: 'CUSTOMER' 
      });
    }
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('login');
  };

  const handleLoginSuccess = (username: string, role: string) => {
    localStorage.setItem('username', username);
    
    // Force Type casting
    const userRole = role as User['role']; 

    setUser({
        id: Date.now(), 
        username,
        role: userRole
    });

    if (role === 'ADMIN') {
       setCurrentPage('admin-dashboard'); 
    } else {
       setCurrentPage('home');
    }
  };

  return (
      <div className="container">
        
        {/* หน้า Home */}
        {currentPage === 'home' && (
          <HomePage navigate={navigate} user={user} onLogout={handleLogout} />
        )}
        
        {/* หน้า Admin Dashboard */}
        {currentPage === 'admin-dashboard' && (
           <AdminDashboard onLogout={handleLogout} />
        )}
        
        {/* หน้า Login */}
        {currentPage === 'login' && (
          <Login onBack={() => navigate('home')} onLoginSuccess={handleLoginSuccess} />
        )}
        
        {currentPage === 'register' && (
          <Register onBack={() => navigate('login')} />
        )}
        
        {currentPage === 'booking' && (
          <Booking onBack={() => navigate('home')} />
        )}

        {/* ✅ แก้ไขตรงนี้ครับ: ลบปุ่มเดิมออก แล้วส่ง onBack เข้าไป */}
        {currentPage === 'history' && (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
              <HistoryPage onBack={() => navigate('home')} />
          </div>
        )}
      </div>
  );
}

export default App;