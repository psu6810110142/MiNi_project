import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. ตรวจสอบว่า Username/Password ถูกต้องไหม
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    // ถ้าหา User ไม่เจอ
    if (!user) return null;

    // ✅ เช็คว่ารหัสผ่านตรงกันไหม (เทียบระหว่างที่พิมพ์มา vs ค่า Hash ใน DB)
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user; // ตัด password ทิ้งก่อนส่งกลับ
      return result; // ส่ง User Object (ที่มี ID) กลับไป
    }

    return null;
  }

  // 2. สร้าง Token
  async login(user: any) {
    console.log("DEBUG LOGIN USER:", user);
    const payload = { 
        username: user.username, 
        sub: user.id,   // ✅ สำคัญมาก: ใส่ ID ลงไปใน Token
        userId: user.id, // ✅ ใส่กันเหนียวไว้อีกตัว
        role: user.role // ✅✅✅ เพิ่มบรรทัดนี้เข้าไปครับ!!!
    };
    console.log("DEBUG PAYLOAD:", payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}