// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }
    

    // หาจาก Username (ใช้ตอน Login)
    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    // 👇 ใช้ตอนดึง Profile (หน้าจอง)
    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            // ✅ เลือกเฉพาะข้อมูลที่จะใช้ (เพื่อความปลอดภัย ไม่เอารหัสผ่าน)
            // เช็คชื่อตัวแปรให้ตรงกับใน Entity นะครับ (fullName, tel)
            select: ['id', 'username', 'fullName', 'phoneNumber']
        });
    }

    // สร้าง User ใหม่ (Register)
    async create(userData: any): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // 🔥 จุดแก้ไข: แปลงร่างข้อมูลก่อนบันทึก
        const newUser = this.usersRepository.create({
            username: userData.username,
            password: hashedPassword,

            // 1. ชื่อ-นามสกุล
            // หน้าบ้านอาจส่งมาเป็น name หรือ fullName ดักไว้ทั้งคู่
            fullName: userData.fullName || userData.name,

            // 2. เบอร์โทร (ตัวปัญหา!)
            // หน้าบ้านส่งมาเป็น "tel" แต่ Database ชื่อ "phoneNumber"
            // ต้องจับคู่ให้มันตรงนี้ครับ 👇
            phoneNumber: userData.phoneNumber || userData.tel || '',

            //role: UserRole.USER, // (ถ้ามี)
        });

        return (await this.usersRepository.save(newUser)) as any;
    }

}