import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { ReservationSeat } from './reservation-seat.entity';

export enum ReservationStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Index()
  @Column()
  userId: string;

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  showtimeId: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.CONFIRMED,
  })
  status: ReservationStatus;

  // snapshot of price at booking time, independent of later price changes
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: string;

  // cascade: true lets us save reservation + seats together in one call;
  // seats are deleted on cancel via service logic, not via this relation
  @OneToMany(() => ReservationSeat, (rs) => rs.reservation, { cascade: true })
  seats: ReservationSeat[];

  @CreateDateColumn()
  createdAt: Date;
}
