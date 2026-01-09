// src/auth/auth.controller.ts (Backend)

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service'; // (ถ้ามี)

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // อันเก่าที่คุณมีอยู่แล้ว (Login)
  @Post('login')
  async login(@Body() body) {
    console.log('💥 0. มีคนเคาะประตู Login! Body ที่ส่งมา:', body);
    return this.authService.login(body);
  }

  // 👇 --- เพิ่มอันนี้เข้าไปครับ! (Register) --- 👇
  @Post('register')
  async register(@Body() body) {
    console.log('ข้อมูลสมัครสมาชิก:', body); // ลองปริ้นท์ดู
    
    // ตรงนี้เรียก Service ไปบันทึกข้อมูลลงฐานข้อมูล
    // ตัวอย่างแบบย่อ (ถ้ายังไม่มี Service ให้ Return หลอกๆ ไปก่อนก็ได้ครับ)
    return { 
      message: 'สมัครสมาชิกสำเร็จ', 
      user: body 
    }; 
  }
  // 👆 ------------------------------------- 👆
}