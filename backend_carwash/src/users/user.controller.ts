import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Endpoint นี้สำหรับดึง users ทั้งหมด (http://localhost:3000/users)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // Endpoint อื่นๆ (Get one, Create, Update, Delete)
  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // แปลง id เป็น number ก่อนส่งเข้า service (ถ้า service รับ number)
    return this.usersService.findById(+id); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}