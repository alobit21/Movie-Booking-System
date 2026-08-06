import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Seat } from './seat.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  capacity: number;

  @OneToMany(() => Seat, (seat) => seat.room, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Showtime, (showtime) => showtime.room)
  showtimes: Showtime[];
}
