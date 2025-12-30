import { Module } from '@nestjs/common';
import { CarwashCategoryService } from './carwash_category.service';
import { CarwashCategoryController } from './carwash_category.controller';

@Module({
  controllers: [CarwashCategoryController],
  providers: [CarwashCategoryService],
})
export class CarwashCategoryModule {}
