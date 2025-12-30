import { Injectable } from '@nestjs/common';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';

@Injectable()
export class CarwashCategoryService {
  create(createCarwashCategoryDto: CreateCarwashCategoryDto) {
    return 'This action adds a new carwashCategory';
  }

  findAll() {
    return `This action returns all carwashCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carwashCategory`;
  }

  update(id: number, updateCarwashCategoryDto: UpdateCarwashCategoryDto) {
    return `This action updates a #${id} carwashCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} carwashCategory`;
  }
}
