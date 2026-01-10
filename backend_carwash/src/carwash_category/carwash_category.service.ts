import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCarwashCategoryDto } from './dto/create-carwash_category.dto';
import { UpdateCarwashCategoryDto } from './dto/update-carwash_category.dto';

// ✅ แก้บรรทัดนี้: เพิ่ม Employee เข้าไปในปีกกา
import { Booking, CarwashCategory, BookingStatus, Employee } from './entities/carwash_category.entity';

@Injectable()
export class CarwashCategoryService implements OnModuleInit {
  
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(CarwashCategory)
    private readonly categoryRepo: Repository<CarwashCategory>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async onModuleInit() {
    console.log("Checking Database Data...");
    // ... (ส่วน Seed ข้อมูลรถ) ...
    const count = await this.categoryRepo.count();
    if (count === 0) {
      await this.categoryRepo.save([
        { id: 1, name: 'S/M', priceMultiplier: 1.0 },
        { id: 2, name: 'L/SUV', priceMultiplier: 1.2 },
        { id: 3, name: 'XL/Van', priceMultiplier: 1.5 },
      ]);
    }

    // Seed พนักงาน
    try {
        const empCount = await this.employeeRepo.count();
        if (empCount === 0) {
            console.log("Seeding Employees...");
            await this.employeeRepo.save([
                { name: 'ช่างหนึ่ง (ล้างสี)', status: 'ACTIVE' },
                { name: 'ช่างสอง (ดูดฝุ่น)', status: 'ACTIVE' },
                { name: 'ช่างสาม (ขัดเงา)', status: 'ACTIVE' },
            ]);
        }
    } catch (error) {
        console.log("⚠️ ข้ามการสร้างพนักงาน (อาจยังไม่ได้สร้าง Table)");
    }
  }

  async createBooking(data: any, userId: number) {
    
    // ดึงพนักงานที่ว่าง
    const activeEmployees = await this.employeeRepo.find({ where: { status: 'ACTIVE' } });
    
    // ตั้งค่าเริ่มต้นเป็น undefined (ไม่ใช่ null) เพื่อกัน Error
    let assignedEmployee: Employee | undefined = undefined;

    if (activeEmployees.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeEmployees.length);
        assignedEmployee = activeEmployees[randomIndex];
        console.log(`🎲 สุ่มได้พนักงาน: ${assignedEmployee.name}`);
    } else {
        console.log("⚠️ ไม่มีพนักงานว่าง (ไม่ระบุช่าง)");
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
      
      // ใส่พนักงานที่สุ่มได้ (หรือ undefined ถ้าไม่มี)
      employee: assignedEmployee 
    });

    return await this.bookingRepo.save(newBooking);
  }

  async findMyBookings(userId: number) {
    return await this.bookingRepo.find({
      where: { customer: { id: userId } },
      relations: ['carwashCategory', 'customer', 'employee'], // ดึงข้อมูลพนักงานมาโชว์ด้วย
      order: { startTime: 'DESC' }, 
    });
  }

  async findAllBookings() {
    return await this.bookingRepo.find({
      // ดึงความสัมพันธ์มาให้ครบ (ลูกค้า, ประเภทรถ, พนักงาน)
      relations: ['customer', 'carwashCategory', 'employee'], 
      order: {
        id: 'DESC', // เรียงจากรายการล่าสุดขึ้นก่อน
      },
    });
  }

  

  // ... CRUD อื่นๆ
  create(dto: CreateCarwashCategoryDto) { return 'action add'; }
  findAll() { return this.categoryRepo.find(); }
  findOne(id: number) { return `action #${id}`; }
  update(id: number, dto: UpdateCarwashCategoryDto) { return `action update #${id}`; }
  remove(id: number) { return `action remove #${id}`; }
}