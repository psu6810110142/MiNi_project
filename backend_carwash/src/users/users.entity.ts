import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../carwash_category/entities/carwash_category.entity';
// Import Role จากไฟล์แยกที่เราสร้างไว้ (แนะนำอันนี้)
import { Role } from './role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // ✅ เหลือ booking ไว้ตามที่ต้องการ
  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];

  @Column({ default: 'AVAILABLE' })
  status: string;
  @OneToMany(() => Booking, (booking) => booking.assignedStaff)
  jobs: Booking[];

  // ✅ แก้ไข: เหลือ role อันเดียว และใช้ Enum Role จากไฟล์แยก
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER, // สมัครใหม่เป็น User เสมอ
  })
  role: Role;
}