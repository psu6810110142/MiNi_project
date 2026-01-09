import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarwashCategoryService } from './carwash_category.service';
import { CarwashCategoryController } from './carwash_category.controller';
import { AuthModule } from '../auth/auth.module';
// 1. Import Entity ทั้งหมดที่จะใช้ (อย่าลืม Booking)
import { CarwashCategory, Booking, Service } from './entities/carwash_category.entity';

@Module({
  imports: [
    // 2. ลงทะเบียน Entity ทั้งหมดตรงนี้!
    // ถ้าขาดตัวไหนไป Service จะเรียกใช้ไม่ได้และ Error แบบในรูปครับ
    TypeOrmModule.forFeature([CarwashCategory, Booking, Service]),
    AuthModule 
  ],
  controllers: [CarwashCategoryController],
  providers: [CarwashCategoryService],
  exports: [CarwashCategoryService] // export เผื่อที่อื่นจะใช้
})
export class CarwashCategoryModule {}