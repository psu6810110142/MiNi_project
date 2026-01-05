import React, { useState } from 'react';
import './App.css'; // อย่าลืมไฟล์ CSS เดิม

// Import หน้าต่างๆ
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Booking from './pages/Booking.jsx';
import Register from './pages/Register.jsx';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, login, register, booking
  const [user, setUser] = useState(null);

  // ฟังก์ชันสลับหน้า
  const navigate = (view) => setCurrentView(view);

  // เมื่อล็อกอินสำเร็จ
  const handleLoginSuccess = (username) => {
    setUser(username);
    navigate('booking'); 
  };

  return (
    <div>
      {/* เลือกแสดงผลตามตัวแปร currentView */}

      {currentView === 'home' && (
        <HomePage navigate={navigate} />
      )}

      {currentView === 'login' && (
        <Login 
          onBack={() => navigate('home')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {currentView === 'register' && (
        <Register onBack={() => navigate('home')} />
      )}

      {currentView === 'booking' && (
        <Booking navigate={navigate} user={user} />
      )}
    </div>
  );
}

export default App;