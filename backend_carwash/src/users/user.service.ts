// src/users/users.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users.entity';
import { Role } from './role.enum'; // ✅ ตรวจสอบ path นี้ว่าถูกต้องไหม

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.seedStaff();
    }

    // ✅ ฟังก์ชันสร้างพนักงาน (แก้ไขแล้ว)
    async seedStaff() {
        const staffList = [
            { name: 'Somchai', tel: '0811111111' },
            { name: 'Malee', tel: '0822222222' },
            { name: 'Wichai', tel: '0833333333' },
            { name: 'Kanda', tel: '0844444444' },
            { name: 'Prasit', tel: '0855555555' },
        ];

        console.log('🌱 Checking & Seeding staff users...');

        for (const staff of staffList) {
            const generatedUsername = staff.name.toLowerCase();

            const exists = await this.usersRepository.findOne({ where: { username: generatedUsername } });

            if (!exists) {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(staff.tel, salt);

                const newStaff = this.usersRepository.create({
                    username: generatedUsername,
                    password: hashedPassword,
                    fullName: staff.name,
                    phoneNumber: staff.tel,

                    // 🚩 จุดที่แก้ 1: ต้องใช้ Enum (ไม่ใช่ String)
                    role: Role.STAFF,

                    // 🚩 จุดที่แก้ 2: ต้องระบุสถานะเริ่มต้นว่า "ว่าง"
                    status: 'AVAILABLE'
                });

                await this.usersRepository.save(newStaff);
                console.log(`✅ Created staff: ${generatedUsername} (Pass: ${staff.tel})`);
            }
        }
    }

    // --- ส่วนเดิม ---

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'username', 'fullName', 'phoneNumber', 'role', 'status'] // ✅ เพิ่ม role, status ให้ดึงไปใช้ได้
        });
    }

    async update(id: number, updateUserDto: any) {
        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({ where: { id } });
    }

    async remove(id: number) {
        await this.usersRepository.delete(id);
        return { deleted: true };
    }

    async findAllStaff(): Promise<User[]> {
        return this.usersRepository.find({
            where: { role: Role.STAFF }, // กรองเฉพาะพนักงาน
            select: ['id', 'username', 'fullName', 'phoneNumber', 'status'], // เลือกส่งไปแค่ข้อมูลที่จำเป็น (สำคัญมาก! ห้ามส่ง password)
            order: { id: 'ASC' }
        });
    }

    // สร้าง User ลูกค้าใหม่ (Register)
    async create(userData: any): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = this.usersRepository.create({
            username: userData.username,
            password: hashedPassword,
            fullName: userData.fullName || userData.name,
            phoneNumber: userData.phoneNumber || userData.tel || '',

            // ✅ ลูกค้าสมัครเอง ให้เป็น USER และสถานะ OFFLINE
            role: Role.USER,
            status: 'OFFLINE'
        });

        return (await this.usersRepository.save(newUser)) as any;
    }
}