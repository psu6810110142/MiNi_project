import { PartialType } from '@nestjs/mapped-types';
import { CreateCarwashCategoryDto } from './create-carwash_category.dto';

export class UpdateCarwashCategoryDto extends PartialType(CreateCarwashCategoryDto) {}
