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

  // 🔥 ส่วนนี้เก็บไว้เหมือนเดิมครับ (มันช่วยเติมข้อมูลประเภทรถให้คุณ)
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

  private staffList = [
    'ช่างหนึ่ง (หัวหน้าทีม)', 'น้องมายด์ (ฝ่ายดูแลสี)', 'พี่เข้ม (ฝ่ายช่วงล่าง)', 'ป้าสมศรี (ฝ่ายดูดฝุ่น)'
  ];

  async createBooking(data: any, userId: number) {
    const randomStaff = this.staffList[Math.floor(Math.random() * this.staffList.length)];

    const newBooking = this.bookingRepo.create({
      startTime: data.startTime,
      endTime: data.endTime,
      totalPrice: data.totalPrice,
      status: BookingStatus.PENDING, 
      customer: { id: userId },
      carwashCategory: { id: data.carTypeId },
    });

    // 🔴 แก้ตรงนี้: เปลี่ยนจาก save เป็น insert เพื่อแก้บัค UpdateValuesMissingError
    // (insert จะไม่พยายามไปยุ่งกับตาราง User หรือ CarType ทำให้ไม่ error)
    const result = await this.bookingRepo.insert(newBooking);
    
    // คืนค่ากลับไปให้เหมือนเดิม (เอา ID ที่เพิ่งสร้างใส่กลับเข้าไป)
    return { ...newBooking, id: result.identifiers[0].id };
  }

  // ในไฟล์ src/carwash_category/carwash_category.service.ts

  async findMyBookings(userId: number) {
    // 🔥 1. เพิ่มบรรทัดนี้: ดูว่า Controller ส่งเลข ID อะไรมาให้ค้นหา?
    console.log("🔍 กำลังค้นหาประวัติของ User ID:", userId); 

    const bookings = await this.bookingRepo.find({
      where: { customer: { id: userId } },
      relations: ['carwashCategory'],
      order: { startTime: 'DESC' }, 
    });
    
    // 🔥 2. เพิ่มบรรทัดนี้: ดูว่าเจอใน Database กี่รายการ?
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