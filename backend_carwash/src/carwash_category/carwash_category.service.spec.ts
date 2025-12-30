import { Test, TestingModule } from '@nestjs/testing';
import { CarwashCategoryService } from './carwash_category.service';

describe('CarwashCategoryService', () => {
  let service: CarwashCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarwashCategoryService],
    }).compile();

    service = module.get<CarwashCategoryService>(CarwashCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
