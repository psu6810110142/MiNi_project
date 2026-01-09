import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // ตรวจสอบ Email และ Password
// ✅ วิธีแก้ที่ถูกต้อง
// ใน src/auth/auth.service.ts

async validateUser(username: string, pass: string): Promise<any> {
  // 1. หา User จาก DB
  const user = await this.usersService.findOne(username);
  
  // 🔥 [เพิ่มตรงนี้] ขอดูหน้าตา User ที่ดึงมาจาก DB สดๆ หน่อยซิ ว่ามี ID ไหม
  console.log('📌 1. ข้อมูลดิบจาก DB:', user); 

  if (user && user.password === pass) {
    
    const result = { 
      id: user.id, // หรือลองเปลี่ยนเป็น user.userId หรือ user._id ดูครับ
      username: user.username, 
      role: user.role
    };

    // 🔥 [เพิ่มตรงนี้] ขอดูสิ่งที่จะส่งออกไปหน่อย
    console.log('📌 2. ข้อมูลที่จะส่งไป Login:', result);

    return result;
  }
  return null;
}

  // สร้าง Token (Payload คือข้อมูลที่จะฝังใน Token)
  // ในไฟล์ src/auth/auth.service.ts

async login(user: any) {
  // 1. ลองปรินต์ดูว่า user ที่ส่งเข้ามาหน้าตาเป็นยังไง
  console.log("User ที่ส่งมาทำ Token:", user); 

  // 2. เช็คว่า ID มันชื่อ 'id', 'userId', หรือ '_id' กันแน่
  // ส่วนใหญ่ถ้ามาจาก TypeORM จะเป็น .id
  const payload = { 
    username: user.username, 
    sub: user.id || user.userId || user._id // กันพลาด ใส่ดักไว้ทุกทาง
  };

  return {
    access_token: this.jwtService.sign(payload),
  };
}
}
