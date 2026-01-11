import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarwashCategoryService } from './carwash_category.service';
import { CarwashCategoryController } from './carwash_category.controller';
import { CarwashCategory, Booking } from './entities/carwash_category.entity';
// ✅ Import User
import { User } from '../users/users.entity'; 

@Module({
  imports: [
    // ✅ เพิ่ม User เข้าไปในลิสต์นี้ เพื่อแก้ error Nest can't resolve dependencies
    TypeOrmModule.forFeature([CarwashCategory, Booking, User]), 
  ],
  controllers: [CarwashCategoryController],
  providers: [CarwashCategoryService],
  exports: [CarwashCategoryService], 
})
export class CarwashCategoryModule {}