import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // สร้าง Endpoint: POST http://localhost:3000/users/register
  @Post('register')
  create(@Body() body: any) {
    // รับข้อมูล (username, password, role) แล้วส่งให้ Service ไปบันทึก
    return this.usersService.create(body);
  }
}