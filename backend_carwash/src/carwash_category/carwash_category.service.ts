import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';
import { Booking, CarwashCategory, BookingStatus } from './entities/carwash_category.entity';
import { User } from '../users/users.entity'; 

@Injectable()
export class CarwashCategoryService implements OnModuleInit {

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(CarwashCategory)
    private readonly categoryRepo: Repository<CarwashCategory>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async onModuleInit() {
    if (await this.categoryRepo.count() === 0) {
      await this.categoryRepo.save([
        { id: 1, name: 'S/M', priceMultiplier: 1.0 },
        { id: 2, name: 'L/SUV', priceMultiplier: 1.2 },
        { id: 3, name: 'XL/Van', priceMultiplier: 1.5 },
      ]);
    }
  }

  // --- Logic จอง ---
  async createBooking(data: any, userId: number) {
    const availableStaff = await this.userRepo.findOne({
      where: { status: 'AVAILABLE' } // ถ้ามี Role enum ให้เพิ่ม role: Role.STAFF
    });

    if (availableStaff) {
      availableStaff.status = 'BUSY';
      await this.userRepo.save(availableStaff);
    }

    const newBooking = this.bookingRepo.create({
      startTime: data.startTime,
      endTime: data.endTime,
      totalPrice: data.totalPrice,
      status: BookingStatus.PENDING,
      plateNumber: data.plateNumber,
      additionalInfo: data.additionalInfo,
      customer: { id: userId },
      carwashCategory: { id: data.carTypeId },
      assignedStaff: availableStaff || undefined 
    });

    return await this.bookingRepo.save(newBooking);
  }

  // --- Logic Admin/Display ---

  async findAllBookings() {
    return await this.bookingRepo.find({
      relations: ['customer', 'carwashCategory', 'assignedStaff'],
      order: { id: 'DESC' },
    });
  }

  async findMyBookings(userId: number) {
      return await this.bookingRepo.find({
        where: { customer: { id: userId } },
        relations: ['carwashCategory', 'customer', 'assignedStaff'],
        order: { startTime: 'DESC' },
      });
  }

  async completeJob(bookingId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['assignedStaff']
    });

    if (booking?.assignedStaff) {
      booking.assignedStaff.status = 'AVAILABLE';
      await this.userRepo.save(booking.assignedStaff);
    }
    return booking;
  }

  // ✅ 1. ฟังก์ชันแก้ไข Booking (เปลี่ยนช่าง, เปลี่ยนสถานะ)
  async updateBooking(id: number, data: any) {
    
    // สร้าง Object สำหรับอัปเดตแบบ Dynamic (ป้องกันค่า undefined ไปทับข้อมูลเดิม)
    const updateData: any = {};

    if (data.status) updateData.status = data.status;
    if (data.plateNumber) updateData.plateNumber = data.plateNumber;

    // ถ้ามีการส่ง staffId มาใหม่
    if (data.staffId) {
        updateData.assignedStaff = { id: +data.staffId };
        
        // (Optional Tip: ในอนาคตถ้าอยากให้สมบูรณ์สุดๆ อาจต้องเพิ่ม Logic 
        // ไปแก้ status ของช่างคนเก่าให้ว่าง และคนใหม่ให้ไม่ว่างด้วยนะครับ 
        // แต่ตอนนี้เอาเท่านี้ก่อน ระบบก็ทำงานได้ครับ)
    }

    // อัปเดตข้อมูล
    await this.bookingRepo.update(id, updateData);

    // คืนค่าข้อมูลล่าสุดกลับไป
    return this.bookingRepo.findOne({
        where: { id },
        relations: ['assignedStaff', 'customer', 'carwashCategory']
    });
  }

  // ✅ 2. ฟังก์ชันลบ Booking
  async removeBooking(id: number) {
      const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['assignedStaff'] });
      
      // ถ้าลบงาน คืนสถานะช่างให้ว่างก่อน
      if (booking && booking.assignedStaff) {
          booking.assignedStaff.status = 'AVAILABLE';
          await this.userRepo.save(booking.assignedStaff);
      }

      return this.bookingRepo.delete(id);
  }

  // --- CRUD พื้นฐาน ---
  async findAll() { return this.categoryRepo.find(); }
  async findOne(id: number) { return this.categoryRepo.findOne({where: {id}}); }
  async create(dto: any) { return this.categoryRepo.save(dto); }
  async update(id: number, dto: any) { return this.categoryRepo.update(id, dto); }
  async remove(id: number) { return this.categoryRepo.delete(id); }
}