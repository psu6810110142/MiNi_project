import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/users.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}



// --- TABLE: CAR_TYPES ---
@Entity('car_types')
export class CarwashCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float', { name: 'price_multiplier', default: 1.0 })
  priceMultiplier: number;
   
  @OneToMany(() => Booking, (booking) => booking.carwashCategory)
  bookings: Booking[];
  
}

// --- TABLE: SERVICES ---
@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('int', { name: 'duration_minutes' })
  durationMinutes: number;

  @Column('decimal', { name: 'base_price', precision: 10, scale: 2 })
  basePrice: number;
}

// --- TABLE: BOOKINGS ---
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @ManyToOne(() => CarwashCategory, (category) => category.bookings)
  @JoinColumn({ name: 'car_type_id' })
  carwashCategory: CarwashCategory;

  // เพิ่มความสัมพันธ์กับพนักงาน (User)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_staff_id' })
  assignedStaff: User;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true }) // เพิ่ม nullable เผื่อยังไม่รู้วันจบ
  endTime: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ nullable: true }) // อนุญาตให้ว่างได้ (เผื่อข้อมูลเก่า)
  plateNumber: string; 

  @Column({ nullable: true })
  additionalInfo: string;
  
  @Column('decimal', { name: 'total_price', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'booking_services',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];
}