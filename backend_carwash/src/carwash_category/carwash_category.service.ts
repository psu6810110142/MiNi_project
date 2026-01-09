import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';
import { Booking, CarwashCategory, BookingStatus } from './entities/carwash_category.entity'; 

@Injectable()
export class CarwashCategoryService implements OnModuleInit {
  
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(CarwashCategory)
    private readonly categoryRepo: Repository<CarwashCategory>,
  ) {}

  async onModuleInit() {
    console.log("Checking Database Data...");
    const count = await this.categoryRepo.count();
    if (count === 0) {
      console.log("Seeding Car Types...");
      await this.categoryRepo.save([
        { id: 1, name: 'S/M', priceMultiplier: 1.0 },
        { id: 2, name: 'L/SUV', priceMultiplier: 1.2 },
        { id: 3, name: 'XL/Van', priceMultiplier: 1.5 },
      ]);
    }
  }

  // --- ส่วนบันทึกการจอง (แก้ตรงนี้) ---
  async createBooking(data: any, userId: number) {
    const newBooking = this.bookingRepo.create({
      startTime: data.startTime,
      endTime: data.endTime,
      totalPrice: data.totalPrice,
      status: BookingStatus.PENDING, 
      
      // ✅ 1. เพิ่มการบันทึกข้อมูลเหล่านี้
      plateNumber: data.plateNumber,      // ทะเบียนรถ
      additionalInfo: data.additionalInfo, // สิ่งที่ต้องการเพิ่มเติม (Note)
      
      customer: { id: userId },
      carwashCategory: { id: data.carTypeId }, 
      // service: { id: data.serviceId } // (ถ้ามี entity Service ให้เปิดบรรทัดนี้ด้วย)
    });

    const result = await this.bookingRepo.insert(newBooking);
    return { ...newBooking, id: result.identifiers[0].id };
  }

  // --- ส่วนดึงประวัติการจอง (แก้ตรงนี้) ---
  async findMyBookings(userId: number) {
    console.log("🔍 กำลังค้นหาประวัติของ User ID:", userId); 

    const bookings = await this.bookingRepo.find({
      where: { customer: { id: userId } },
      
      // ✅ 2. เพิ่ม 'customer' เข้าไปใน relations เพื่อดึงชื่อและเบอร์โทร
      // (ถ้ามี Service entity ก็เพิ่ม 'service' เข้าไปในนี้ด้วย เช่น ['carwashCategory', 'customer', 'service'])
      relations: ['carwashCategory', 'customer'], 
      
      order: { startTime: 'DESC' }, 
    });
    
    console.log("✅ ผลลัพธ์ที่เจอใน DB:", bookings.length, "รายการ");

    return bookings;
  }
  
  // --- CRUD เดิม ---
  create(createCarwashCategoryDto: CreateCarwashCategoryDto) { return 'This action adds a new carwashCategory'; }
  findAll() { return this.categoryRepo.find(); }
  findOne(id: number) { return `This action returns a #${id} carwashCategory`; }
  update(id: number, updateCarwashCategoryDto: UpdateCarwashCategoryDto) { return `This action updates a #${id} carwashCategory`; }
  remove(id: number) { return `This action removes a #${id} carwashCategory`; }
}