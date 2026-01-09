import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import Login from './pages/Loginpage.jsx';
import Register from './pages/Register';
import Booking from './pages/Booking';
import HistoryPage from './pages/History.jsx';
import './App.css';

// ❌ ลบ function App() ตัวแรกที่เป็น BrowserRouter ทิ้งไปเลยครับ

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // สร้างตัวแปรเก็บข้อมูล user
  const [user, setUser] = useState(null);

  // เช็คตอนเริ่มเข้าเว็บว่าเคยล็อกอินค้างไว้ไหม
  useEffect(() => {
    const token = localStorage.getItem('token'); // หรือ 'access_token' เช็คชื่อ key ให้ตรงกับตอน login นะครับ
    const savedUsername = localStorage.getItem('username'); 
    
    if (token && savedUsername) {
      setUser({ username: savedUsername });
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // ฟังก์ชันเมื่อ Login สำเร็จ
  const handleLoginSuccess = (username) => {
    localStorage.setItem('username', username);
    setUser({ username });
    navigate('home');
  };

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // ตรวจสอบว่าใช้ 'token' หรือ 'access_token'
    localStorage.removeItem('username');
    setUser(null);
    navigate('login');
  };

  return (
    <div className="container">
      {/* --- หน้า Home --- */}
      {currentPage === 'home' && (
        <HomePage 
          navigate={navigate} 
          user={user}            
          onLogout={handleLogout} 
        />
      )}
      
      {/* --- หน้า Login --- */}
      {currentPage === 'login' && (
        <Login 
          onBack={() => navigate('home')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {/* --- หน้า Register --- */}
      {currentPage === 'register' && (
        <Register onBack={() => navigate('login')} />
      )}
      
      {/* --- หน้า Booking --- */}
      {currentPage === 'booking' && (
        <Booking onBack={() => navigate('home')} />
      )}

      {/* --- ✅ 2. เพิ่มหน้า History ตรงนี้ --- */}
      {currentPage === 'history' && (
        <div>
            {/* ปุ่มย้อนกลับ (เพราะ HistoryPage ที่ให้ไปอาจจะไม่มีปุ่ม Back) */}
            <button 
                onClick={() => navigate('home')}
                style={{ margin: '20px', padding: '10px', cursor: 'pointer' }}
            >
                ⬅ ย้อนกลับหน้าหลัก
            </button>
            <HistoryPage />
        </div>
      )}
    </div>
  );
}

export default App;