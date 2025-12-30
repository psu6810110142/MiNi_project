import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarwashCategoryService } from './carwash_category.service';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';

@Controller('carwash-category')
export class CarwashCategoryController {
  constructor(private readonly carwashCategoryService: CarwashCategoryService) {}

  @Post()
  create(@Body() createCarwashCategoryDto: CreateCarwashCategoryDto) {
    return this.carwashCategoryService.create(createCarwashCategoryDto);
  }

  @Get()
  findAll() {
    return this.carwashCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carwashCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarwashCategoryDto: UpdateCarwashCategoryDto) {
    return this.carwashCategoryService.update(+id, updateCarwashCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carwashCategoryService.remove(+id);
  }
}
