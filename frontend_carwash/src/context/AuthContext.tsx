import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import ตัวแกะ Token

// กำหนดหน้าตาของ User ที่อยู่ใน Token
interface UserPayload {
  username: string;
  sub: number;
  role: 'USER' | 'ADMIN'; // ต้องตรงกับที่ Backend ส่งมา
  exp: number; // วันหมดอายุ
}

interface AuthContextType {
  user: UserPayload | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);

  // 1. เช็ค LocalStorage เมื่อเข้าเว็บมาครั้งแรก (เพื่อให้ Refresh แล้วไม่หลุด)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        // เช็คว่า Token หมดอายุยัง (optional)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          logout(); // ถ้าหมดอายุให้เคลียร์ทิ้ง
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  // 2. ฟังก์ชัน Login: รับ Token มาเก็บและแกะข้อมูล
  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode<UserPayload>(token);
    setUser(decoded);
  };

  // 3. ฟังก์ชัน Logout: ล้างทุกอย่าง
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // อาจจะ Redirect ไปหน้า Login ด้วย window.location หรือ navigate
  };

  // Helper เช็คว่าเป็น Admin ไหม
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook ให้เรียกใช้ง่ายๆ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};