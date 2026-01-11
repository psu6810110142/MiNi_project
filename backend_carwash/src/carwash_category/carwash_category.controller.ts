import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request, BadRequestException
} from '@nestjs/common';

import { CarwashCategoryService } from './carwash_category.service';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('carwash')
export class CarwashCategoryController {
  constructor(private readonly carwashCategoryService: CarwashCategoryService) { }

  // ============================================
  // 🟢 1. ระบบจอง (Booking)
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async createBooking(@Request() req, @Body() body: any) {
    // ดึง ID ชัวร์ๆ ไม่ว่าจะมาท่าไหน (userId, user_id, id)
    const userId = req.user.userId || req.user.user_id || req.user.id;
    
    console.log(`📩 [API] User ID: ${userId} กำลังจองคิว...`);
    
    if (!userId) {
       throw new BadRequestException('ไม่พบข้อมูลผู้ใช้ (Token ผิดพลาด)');
    }

    return this.carwashCategoryService.createBooking(body, userId);
  }

  // ============================================
  // 🟢 2. ดูประวัติการจองของฉัน
  // ============================================
  @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getMyBookings(@Request() req) {
    const userId = req.user.userId || req.user.user_id || req.user.id;
    console.log(`🔍 [API] ดึงประวัติของ User ID: ${userId}`);
    
    return this.carwashCategoryService.findMyBookings(userId);
  }

  // ============================================
  // 🟢 3. ดูรายการจองทั้งหมด (สำหรับ Admin/Dashboard)
  // ============================================
  // @UseGuards(JwtAuthGuard) // เปิด comment ถ้าอยากล็อกสิทธิ์ Admin
  @Get('all-bookings')
  async getAllBookings() {
      return this.carwashCategoryService.findAllBookings();
  }

  // ============================================
  // 🔴 4. จบงาน (สำคัญ! ต้องมีเพื่อคืนสถานะพนักงาน)
  // ============================================
  // ยิงมาที่: POST /carwash-category/complete-job/15 (เลข Booking ID)
  @Post('complete-job/:bookingId')
  async completeJob(@Param('bookingId') bookingId: string) {
      console.log(`🏁 [API] สั่งจบงาน Booking ID: ${bookingId}`);
      return this.carwashCategoryService.completeJob(+bookingId);
  }

  @Get('bookings')
  findAllBookings() {
    return this.carwashCategoryService.findAllBookings();
  }

  // ✅ 2. เพิ่มอันนี้: ดึงรายการจองของตัวเอง (สำหรับ User)
  // ลิงก์เรียกใช้: http://localhost:3000/carwash/my-bookings/1
  @Get('my-bookings/:userId')
  findMyBookings(@Param('userId') userId: string) {
    return this.carwashCategoryService.findMyBookings(+userId);
  }

  // ... (Endpoint เดิม) ...

  // ✅ API สำหรับแก้ไข Booking
  // PATCH: http://localhost:3000/carwash/bookings/15
  @Patch('bookings/:id')
  updateBooking(@Param('id') id: string, @Body() body: any) {
    return this.carwashCategoryService.updateBooking(+id, body);
  }

  // ✅ API สำหรับลบ Booking
  // DELETE: http://localhost:3000/carwash/bookings/15
  @Delete('bookings/:id')
  removeBooking(@Param('id') id: string) {
    return this.carwashCategoryService.removeBooking(+id);
  }

  // ============================================
  // 🔵 CRUD เดิม (Categories)
  // ============================================
  @Post()
  create(@Body() createDto: CreateCarwashCategoryDto) { return this.carwashCategoryService.create(createDto); }

  @Get()
  findAll() { return this.carwashCategoryService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.carwashCategoryService.findOne(+id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCarwashCategoryDto) { return this.carwashCategoryService.update(+id, updateDto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.carwashCategoryService.remove(+id); }
}  