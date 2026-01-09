import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // ✅ Inject เข้ามาเพื่อใช้ตอน Register
  ) {}

  // ล็อกอิน
  @Post('login')
  async login(@Body() body) {
    // 1. ส่งไปตรวจรหัสผ่านก่อน
    const user = await this.authService.validateUser(body.username, body.password);
    
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // 2. ถ้าผ่าน ส่งไปทำ Token
    return this.authService.login(user);
  }

  // สมัครสมาชิก
  @Post('register')
  async register(@Body() body) {
    // ✅ เรียก UsersService ให้บันทึกลง DB จริงๆ
    const newUser = await this.usersService.create(body);
    
    return { 
      message: 'สมัครสมาชิกสำเร็จ', 
      user: { 
          id: newUser.id,
          username: newUser.username 
      } 
    }; 
  }
}