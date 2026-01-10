import { Module ,forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './users.entity';

// ✅ เพิ่ม Import
import { AdminController } from './admin.controller'; 
import { CarwashCategoryModule } from '../carwash_category/carwash_category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CarwashCategoryModule),
  ],
  providers: [UsersService],
  controllers: [
    UsersController, 
    AdminController // 👈👈👈 บรรทัดนี้สำคัญสุด! ต้องใส่ ไม่งั้น 404
  ],
  exports: [UsersService],
})
export class UsersModule {}