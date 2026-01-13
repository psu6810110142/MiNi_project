// src/pages/Register.tsx

import React, { useState } from 'react';
import { User, Lock, Phone, UserPlus, ChevronLeft, Sparkles } from 'lucide-react';

// ✅ 1. กำหนด Type ของ Props
interface RegisterProps {
  onBack: () => void;
}

// ✅ 2. กำหนด Type ของข้อมูลใน Form
interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  tel: string;
}

const Register: React.FC<RegisterProps> = ({ onBack }) => {
  // ✅ 3. ใช้ Type ที่สร้างไว้กับ useState
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    tel: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false); 

  // ✅ 4. ใส่ Type ให้ event ของการเปลี่ยนค่า input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 5. ใส่ Type ให้ event ของการ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกันครับ");
      return;
    }

    setIsLoading(true);

    try {
        const payload = {
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName, 
            tel: formData.tel           
        };

        const response = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
            onBack(); 
        } else {
            alert(`❌ สมัครไม่ผ่าน: ${data.message || 'เกิดข้อผิดพลาด'}`);
        }

    } catch (error) {
        console.error("Register Error:", error);
        alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <style>{`
        .register-wrapper { min-height: 100vh; background-color: #f8fafc; font-family: 'Prompt', sans-serif; padding-bottom: 40px; }
        .reg-header { background: white; padding: 20px; position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .btn-back-icon { background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #334155; cursor: pointer; transition: 0.2s; }
        .reg-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; }
        .placeholder-box { width: 40px; }
        .reg-content { padding: 30px 25px; max-width: 500px; margin: 0 auto; }
        .welcome-text h2 { font-size: 1.8rem; font-weight: 800; color: #1e3a8a; margin: 0 0 10px; }
        .welcome-text p { color: #64748b; margin: 0 0 30px; font-size: 0.95rem; }
        .reg-form-group { margin-bottom: 20px; }
        .reg-label { display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .reg-input-wrapper { position: relative; }
        .reg-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .reg-input { width: 100%; padding: 14px 14px 14px 45px; border: 1px solid #cbd5e1; border-radius: 14px; font-size: 1rem; background: white; color: #0f172a; transition: 0.2s; box-sizing: border-box; }
        .reg-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        .btn-register { width: 100%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; padding: 16px; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4); margin-top: 20px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s; }
        .btn-register:disabled { background: #94a3b8; cursor: not-allowed; }
        .login-link { text-align: center; margin-top: 25px; font-size: 0.95rem; color: #64748b; }
        .login-link button { background: none; border: none; color: #2563eb; font-weight: 700; cursor: pointer; font-size: 0.95rem; margin-left: 5px; }
      `}</style>

      {/* Navbar */}
      <div className="reg-header">
        <button onClick={onBack} className="btn-back-icon"><ChevronLeft size={24} /></button>
        <h1 className="reg-title">สมัครสมาชิก</h1>
        <div className="placeholder-box"></div>
      </div>

      <div className="reg-content">
        <div className="welcome-text">
          <h2>เริ่มต้นใช้งาน <span style={{color:'#2563eb'}}>CleanWash</span></h2>
          <p>กรอกข้อมูลเพื่อสร้างบัญชีใหม่ของคุณ</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="reg-form-group">
            <label className="reg-label">ชื่อ-นามสกุล</label>
            <div className="reg-input-wrapper">
              <UserPlus size={20} className="reg-icon"/>
              <input type="text" name="fullName" className="reg-input" placeholder="สมชาย ใจดี" value={formData.fullName} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="reg-form-group">
            <label className="reg-label">เบอร์โทรศัพท์</label>
            <div className="reg-input-wrapper">
              <Phone size={20} className="reg-icon"/>
              <input type="tel" name="tel" className="reg-input" placeholder="08x-xxx-xxxx" value={formData.tel} onChange={handleChange} required />
            </div>
          </div>

          <div className="reg-form-group">
            <label className="reg-label">ชื่อผู้ใช้งาน (Username)</label>
            <div className="reg-input-wrapper">
              <User size={20} className="reg-icon"/>
              <input type="text" name="username" className="reg-input" placeholder="ตั้งชื่อผู้ใช้ของคุณ" value={formData.username} onChange={handleChange} required />
            </div>
          </div>

          <div className="reg-form-group">
            <label className="reg-label">รหัสผ่าน</label>
            <div className="reg-input-wrapper">
              <Lock size={20} className="reg-icon"/>
              <input type="password" name="password" className="reg-input" placeholder="อย่างน้อย 6 ตัวอักษร" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="reg-form-group">
            <label className="reg-label">ยืนยันรหัสผ่าน</label>
            <div className="reg-input-wrapper">
              <Lock size={20} className="reg-icon"/>
              <input type="password" name="confirmPassword" className="reg-input" placeholder="กรอกรหัสผ่านอีกครั้ง" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn-register" disabled={isLoading}>
            {isLoading ? 'กำลังบันทึก...' : 'ลงทะเบียนทันที'} <Sparkles size={20} />
          </button>
        </form>

        <div className="login-link">มีบัญชีอยู่แล้ว? <button onClick={onBack}>เข้าสู่ระบบ</button></div>
      </div>
    </div>
  );
};

export default Register;