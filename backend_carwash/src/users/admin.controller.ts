// src/users/admin.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/user.service';
// ✅ 1. เอา comment ออก และเช็ค Path ให้ถูก
import { CarwashCategoryService } from '../carwash_category/carwash_category.service'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../users/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    // ✅ 2. เอา comment ออก เพื่อ Inject Service
    private readonly bookingService: CarwashCategoryService, 
  ) {}

  @Get('users')
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('bookings')
  @Roles(Role.ADMIN)
  getAllBookings() {
    // ✅ 3. เรียกใช้ฟังก์ชันจริงๆ (ไม่ใช่ return String)
    return this.bookingService.findAllBookings(); 
  }
}