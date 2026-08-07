import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';
import { Seat } from '../../rooms/entities/seat.entity';

@Entity('reservation_seats')
@Unique(['showtime', 'seat']) // <-- DB-level overbooking guard (Approach B)
export class ReservationSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @ManyToOne(() => Reservation, (reservation) => reservation.seats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation | undefined;

  @Column()
  reservationId: string | undefined;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime | undefined;

  @Column()
  showtimeId: string | undefined;

  @ManyToOne(() => Seat, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'seatId' })
  seat: Seat | undefined;

  @Column()
  seatId: string | undefined;
}
