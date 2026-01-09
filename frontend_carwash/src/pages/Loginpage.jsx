// src/pages/Login.jsx
import React, { useState } from 'react';
import { User, Lock, ChevronLeft, LogIn, Sparkles } from 'lucide-react';

const Login = ({ onBack, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.username || !credentials.password) {
        setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }

    setLoading(true);

    try {
        localStorage.clear(); // ล้างของเก่า

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
            const rawToken = data.access_token || data.token; 
            
            if (rawToken) {
                // บันทึกแบบดิบๆ ไปเลย เดี๋ยวไปล้างหน้าจองเอา
                localStorage.setItem('access_token', rawToken);
                onLoginSuccess(credentials.username); 
            } else {
                setError('ไม่พบ Token ในการตอบกลับ');
            }
        } else {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }

    } catch (err) {
        console.error("Login Error:", err);
        setError('ไม่สามารถเชื่อมต่อ Server ได้');
    } finally {
        setLoading(false);
    }
  };

  // ส่วน JSX (ไม่เปลี่ยนแปลง)
  return (
    <div className="login-wrapper">
      <style>{`
        .login-wrapper { min-height: 100vh; background-color: #f8fafc; font-family: 'Prompt', sans-serif; }
        .login-header { padding: 20px; display: flex; align-items: center; justify-content: space-between; }
        .btn-back-icon { background: white; border: 1px solid #e2e8f0; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #334155; cursor: pointer; }
        .login-content { padding: 20px 30px; max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; min-height: 70vh; }
        .brand-section { text-align: center; margin-bottom: 40px; }
        .brand-logo { width: 60px; height: 60px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
        .brand-section h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0 0 5px; }
        .brand-section p { color: #64748b; margin: 0; }
        .input-group { margin-bottom: 20px; }
        .input-label { display: block; font-size: 0.95rem; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .input-modern { width: 100%; padding: 16px 16px 16px 50px; border: 1px solid #cbd5e1; border-radius: 16px; font-size: 1rem; background: white; color: #0f172a; box-sizing: border-box; }
        .input-modern:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .btn-login-main { width: 100%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; padding: 16px; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-login-main:disabled { background: #94a3b8; cursor: not-allowed; }
        .error-msg { background: #fef2f2; color: #ef4444; padding: 12px; border-radius: 12px; margin-bottom: 20px; text-align: center; font-size: 0.9rem; border: 1px solid #fee2e2; }
      `}</style>
      <div className="login-header">
        <button onClick={onBack} className="btn-back-icon"><ChevronLeft size={24} /></button>
      </div>
      <div className="login-content">
        <div className="brand-section">
          <div className="brand-logo"><Sparkles size={32} color="white" /></div>
          <h1>ยินดีต้อนรับกลับ</h1>
          <p>เข้าสู่ระบบเพื่อจองคิวล้างรถ</p>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">ชื่อผู้ใช้งาน</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input type="text" className="input-modern" placeholder="กรอก Username ของคุณ" value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">รหัสผ่าน</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" className="input-modern" placeholder="กรอกรหัสผ่าน" value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-login-main" disabled={loading}>
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'} <LogIn size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;