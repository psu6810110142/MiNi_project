// หาไฟล์ใน folder: src/carwash_category/dto/...
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  // ... ตัวแปรเดิมที่มีอยู่แล้ว (startTime, endTime, totalPrice...)

  @IsNumber()
  carTypeId: number;

  @IsNumber()
  serviceId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  totalPrice: number;

  // 👇👇 เพิ่ม 2 ก้อนนี้เข้าไปครับ (สำคัญมาก!) 👇👇

  @IsOptional()  // บอกว่า "มีก็ได้ ไม่มีก็ได้"
  @IsString()    // บอกว่า "ต้องเป็นตัวหนังสือ"
  plateNumber?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  // 👆👆 จบส่วนที่ต้องเพิ่ม 👆👆
}
export class CreateCarwashCategoryDto {}
