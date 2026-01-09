import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import Login from './pages/Loginpage.jsx';
import Register from './pages/Register';
import Booking from './pages/Booking';
import HistoryPage from './pages/History.jsx'; 
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    if (token && savedUsername) {
      setUser({ username: savedUsername });
    }
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (username) => {
    localStorage.setItem('username', username);
    setUser({ username });
    navigate('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    navigate('login');
  };

  return (
    <div className="container">
      {currentPage === 'home' && (
        <HomePage navigate={navigate} user={user} onLogout={handleLogout} />
      )}
      
      {currentPage === 'login' && (
        <Login onBack={() => navigate('home')} onLoginSuccess={handleLoginSuccess} />
      )}
      
      {currentPage === 'register' && (
        <Register onBack={() => navigate('login')} />
      )}
      
      {/* ✅ Booking ส่ง onBack ให้แล้ว ปุ่ม Home จะกดได้ */}
      {currentPage === 'booking' && (
        <Booking onBack={() => navigate('home')} />
      )}

      {currentPage === 'history' && (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            {/* ✅ ย้ายปุ่มไปขวาบน (Flex End) ตามลูกศรที่วาดมา */}
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
  );
}

export default App;