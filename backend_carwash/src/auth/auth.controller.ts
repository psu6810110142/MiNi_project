// src/auth/auth.controller.ts

import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // ล็อกอิน
  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    return this.authService.login(user);
  }

  // สมัครสมาชิก 
  @Post('register')
  async register(@Body() body) {
    const newUser = await this.usersService.create(body);
    return { 
      message: 'สมัครสมาชิกสำเร็จ', 
      user: { 
          id: newUser.id,
          username: newUser.username 
      } 
    }; 
  }

  //เพิ่ม API สำหรับดึงข้อมูลส่วนตัว (Profile)
  @UseGuards(AuthGuard('jwt')) // ต้องมี Token ถึงจะเข้าได้
  @Get('profile')
  async getProfile(@Request() req) {
    // req.user.userId มาจาก Token ที่เราแกะออกมาใน JwtStrategy
    console.log("👤 User ID ที่ขอข้อมูล:", req.user.userId);
    
    // ไปดึงข้อมูลสดๆ จาก DB
    const user = await this.usersService.findById(req.user.userId);
    
    return user; // ส่งกลับไปให้หน้าบ้าน (React)
  }
}