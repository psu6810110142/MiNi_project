import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Modules
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarwashCategoryModule } from './carwash_category/carwash_category.module';

// Entities: Import ทุกตัวมาจากไฟล์เดียวกัน (ตาม path ที่คุณเคยเขียนไว้)
import { 
  User, 
  CarwashCategory, 
  Service, 
  Booking 
} from './carwash_category/entities/carwash_category.entity'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5434,
        username: configService.get<string>('DB_USERNAME') || 'admin',
        password: configService.get<string>('DB_PASSWORD') || '123451',
        database: configService.get<string>('DB_DATABASE') || 'carwashmini_dev',
        
        // ใส่ชื่อ Class Entity ให้ครบทุกตัวที่ import มา
        entities: [User, CarwashCategory, Service, Booking], 
        
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    AuthModule,
    CarwashCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}