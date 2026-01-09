import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. เปิด CORS (บรรทัดนี้สำคัญมากสำหรับการแก้ Error สีแดงในรูปสุดท้าย)
  app.enableCors();

  // 2. สั่งรัน Server (ต้องมีบรรทัดเดียว! ห้ามมี app.listen ซ้ำ)
  await app.listen(3000);
}
bootstrap();