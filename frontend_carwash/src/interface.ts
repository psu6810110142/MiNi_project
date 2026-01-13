// src/interfaces.ts

// 1. User (พนักงาน และ ลูกค้า)
export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  plateNumber?: string; // ใส่ ? แปลว่ามีหรือไม่มีก็ได้ (เผื่อเป็น Admin)
}

// 2. Service (รายการล้างรถ)
export interface Service {
  id: number;
  name: string; // เช่น "ล้างสี ดูดฝุ่น"
  price: number;
  durationMinutes: number;
}

// 3. Booking (ใบจอง)
export interface Booking {
  id: number;
  startTime: string; // รับมาจาก Backend มักเป็น String Date
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  userId: number;
  user?: User;       // เผื่อ join ตารางมา
  services?: Service[]; // จองได้หลายบริการ
}