import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// --- TABLE: USERS ---
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER,
    // ตั้งชื่อใหม่เพื่อแก้ปัญหา Database จำค่าผิด
    enumName: 'user_role_enum_new_v2_final' 
  })
  role: UserRole;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // 👇 เพิ่มบรรทัดนี้กลับมาครับ เพื่อให้ Booking ไม่แดง
  @OneToMany(() => Booking, (booking) => booking.customer)
  bookings: Booking[];
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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_staff_id' })
  assignedStaff: User;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column('decimal', { name: 'total_price', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'booking_services',
    joinColumn: { name: 'booking_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];
}