import { Test, TestingModule } from '@nestjs/testing';
import { CarwashCategoryController } from './carwash_category.controller';
import { CarwashCategoryService } from './carwash_category.service';

describe('CarwashCategoryController', () => {
  let controller: CarwashCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarwashCategoryController],
      providers: [CarwashCategoryService],
    }).compile();

    controller = module.get<CarwashCategoryController>(CarwashCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
