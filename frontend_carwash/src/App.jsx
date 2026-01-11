import React, { useState, useEffect } from 'react';
import HomePage from './pages/Homepage';
import Login from './pages/Loginpage.jsx'; // ตรวจสอบชื่อไฟล์ให้ตรง (Loginpage หรือ Login)
import Register from './pages/Register';
import Booking from './pages/Booking';
import HistoryPage from './pages/History.jsx'; 
import AdminDashboard from './pages/AdminDashboard'; // ✅ 1. Import AdminDashboard
import { AuthProvider } from './context/AuthContext'; // ✅ 2. Import AuthProvider
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // ยังคงเก็บ user state ไว้ในนี้เพื่อให้ HomePage ใช้งานได้เหมือนเดิม
  // (แต่จริงๆ ในอนาคต HomePage ควรไปใช้ useAuth แทน)
  const [user, setUser] = useState(null);

  useEffect(() => {
    // เช็ค User เก่าตอน Refresh (สำหรับ Logic เดิมของ App.js)
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUser({ username: savedUsername });
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    // ล้างทั้งระบบเก่าและใหม่
    localStorage.clear();
    setUser(null);
    navigate('login');
  };

  // ✅ 3. รวมร่าง handleLoginSuccess ให้เหลืออันเดียว และรองรับ Role
  const handleLoginSuccess = (username, role) => {
    // Save สำหรับ Logic เดิม
    localStorage.setItem('username', username);
    setUser({ username });

    // Logic ใหม่: เช็ค Role เพื่อเปลี่ยนหน้า
    if (role === 'ADMIN') {
       setCurrentPage('admin-dashboard'); 
    } else {
       setCurrentPage('home');
    }
  };

  return (
    // ✅ 4. ครอบด้วย AuthProvider เพื่อให้ทุกหน้าใช้ Context ได้
    <AuthProvider>
      <div className="container">
        
        {/* หน้า Home */}
        {currentPage === 'home' && (
          <HomePage navigate={navigate} user={user} onLogout={handleLogout} />
        )}
        
        {/* หน้า Admin Dashboard (เพิ่มใหม่) */}
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

        {currentPage === 'history' && (
          <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <button 
                      onClick={() => navigate('home')}
                      style={{ 
                          padding: '8px 16px', 
                          cursor: 'pointer', 
                          border: '1px solid #ddd',
                          borderRadius: '20px',
                          background: 'white',
                          fontWeight: '600',
                          color: '#555',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                  >
                      ⬅ ย้อนกลับหน้าหลัก
                  </button>
              </div>
              <HistoryPage />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;