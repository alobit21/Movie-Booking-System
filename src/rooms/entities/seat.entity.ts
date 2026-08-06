import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Room } from './room.entity';

export enum SeatType {
  STANDARD = 'standard',
  VIP = 'vip',
  ACCESSIBLE = 'accessible',
}

@Entity('seats')
@Unique(['room', 'row', 'number']) // no duplicate seats in a room
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: string;

  @Column()
  row: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.STANDARD })
  seatType: SeatType;
}
