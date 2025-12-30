import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'secretKey123', 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  
  // 👇 จุดสำคัญ! ต้องมี AuthService ใน providers ด้วย ถึงจะ export ได้
  providers: [AuthService], 
  
  // ถ้าต้องการ export ให้ module อื่นใช้ (ถ้าไม่จำเป็น ลบบรรทัด exports ทิ้งก็ได้ครับ)
  exports: [AuthService], 
})
export class AuthModule {}