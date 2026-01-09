import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
// 👇 Import Booking เข้ามา (Path นี้ถูกต้อง ถ้าไฟล์ Booking อยู่ใน carwash_category/entities)
import { Booking } from '../carwash_category/entities/carwash_category.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true }) 
  fullName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;



  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ✅ เหลือไว้แค่ Booking พอครับ (History ลบทิ้งไปก่อน ตัวปัญหา)
  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];
}