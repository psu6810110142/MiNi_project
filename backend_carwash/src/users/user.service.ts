import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../carwash_category/entities/carwash_category.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    // แก้ตรงนี้ครับ
    async create(userData: any): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
        });

        // เติม await และ as User เพื่อยืนยันว่าเป็นข้อมูลตัวเดียว
        return (await this.usersRepository.save(newUser)) as any;
    }
}