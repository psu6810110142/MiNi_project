import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Import Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarwashCategoryModule } from './carwash_category/carwash_category.module';

// Import Entities
import { User } from './users/users.entity';
import { Booking, CarwashCategory, Service } from './carwash_category/entities/carwash_category.entity';

@Module({
  imports: [
    // ✅ โหลดไฟล์ .env (ถ้ามี)
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',

      // ✅ ใช้ process.env ถ้าไม่มีให้ใช้ค่า Default (สำหรับรัน Local)
      host: process.env.DB_HOST || 'localhost',

      // ⚠️ จุดสำคัญ: ถ้าอยู่ใน Docker ใช้ 5432, ถ้ารัน Local ใช้ 5434
      port: parseInt(process.env.DB_PORT ?? '5434'),

      username: process.env.DB_USERNAME || 'admin',
      password: process.env.DB_PASSWORD || '123451',
      database: process.env.DB_NAME || 'carwashmini_dev',

      // ใส่ Entity ครบแล้ว เยี่ยมครับ
      entities: [User, Booking, CarwashCategory, Service,],
      synchronize: true, // ⚠️ อย่าลืมเปลี่ยนเป็น false ตอนขึ้น Production จริงนะครับ
    }),
    UsersModule,
    AuthModule,
    CarwashCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }