import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// ❌ ลบบรรทัดที่ Error ทิ้ง (ที่ import จาก ./jwt-auth.guard)
// ✅ เปลี่ยนเป็นบรรทัดนี้ครับ:
import { JwtStrategy } from './jwt.strategy'; 

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secretKey123', 
      signOptions: { expiresIn: '1h' }, // อายุ Token (เช่น 1 ชั่วโมง)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // ต้องไม่มีขีดแดงแล้ว
  exports: [AuthService, PassportModule],
})
export class AuthModule {}