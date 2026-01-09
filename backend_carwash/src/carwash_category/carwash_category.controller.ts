// ✅ จุดที่แก้ 1: Import ให้ครบ และมาจาก @nestjs/common
import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, Request
} from '@nestjs/common';

import { CarwashCategoryService } from './carwash_category.service';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';

// ✅ จุดที่แก้ 2: เช็ค Path ไฟล์ Guard ของคุณ (ส่วนใหญ่จะชื่อ jwt-auth.guard.ts)
// ลองดูว่าไฟล์คุณชื่ออะไร แล้วแก้ชื่อตรงนี้ให้ตรง
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('carwash-category')
export class CarwashCategoryController {
  constructor(private readonly carwashCategoryService: CarwashCategoryService) { }

  // --- ระบบจอง & ประวัติ ---

  @UseGuards(JwtAuthGuard)
  @Post('book')
  async book(@Body() body: any, @Request() req) {
    // req.user.id มาจาก Token
    return this.carwashCategoryService.createBooking(body, req.user.id);
  }

 @UseGuards(JwtAuthGuard)
  @Get('my-bookings')
  async getMyBookings(@Request() req) {
    // 🔥 แอบดูไส้ในว่า User หน้าตาเป็นยังไง
    console.log("--- DEBUG USER DATA ---");
    console.log(req.user); 
    console.log("-----------------------");

    // ลองดักจับทุกชื่อที่เป็นไปได้
    const userId = req.user.userId;
    console.log("🔍 Controller ได้รับ User ID:", userId); // เช็ค Log ตรงนี้
    if (!userId) {
        console.error("❌ หา User ID ไม่เจอ! (ต้องแก้ที่ jwt.strategy.ts)");
        return []; // ส่งค่าว่างไปก่อน กัน Error
    }

    return this.carwashCategoryService.findMyBookings(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async createBooking(@Request() req, @Body() body: any) {
    // ส่ง userId จาก Token ไปให้ Service
    return this.carwashCategoryService.createBooking(body, req.user.userId);
  }


  @UseGuards(JwtAuthGuard)
  @Get('my-history')
  async getMyHistory(@Request() req) {
    return this.carwashCategoryService.findMyBookings(req.user.id);
  }

  // --- CRUD เดิม ---
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