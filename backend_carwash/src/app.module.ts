import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Import Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarwashCategoryModule } from './carwash_category/carwash_category.module';

// Import Entities
// ✅ แก้คำผิด: ลบ สระอี ออก (จาก 'user.entity' เป็น 'user.entity')
import { User } from './users/users.entity'; 
import { Booking, CarwashCategory, Service } from './carwash_category/entities/carwash_category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434, 
      username: 'admin',
      password: '123451', 
      database: 'carwashmini_dev',

      // ใส่ Entity ให้ครบ
      entities: [User, Booking, CarwashCategory, Service],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    CarwashCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }