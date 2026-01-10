import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';
// import DTO ถ้ามี

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint: POST http://localhost:3000/users/register
  @Post('register')
  create(@Body() body: any) {
    // ส่งข้อมูลไปให้ Service บันทึก
    // ข้อควรระวัง: ปกติเราจะไม่ให้ส่ง 'role' มาจากหน้าบ้านตรงๆ ใน production 
    // แต่ช่วง dev ส่งมาเทสก่อนได้ครับ
    return this.usersService.create(body);
  }
}