import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('showtimes')
@Index(['room', 'startTime']) // fast "is this room free" / date-range lookups
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: string;

  // RESTRICT: don't allow deleting a room that still has showtimes
  @ManyToOne(() => Room, (room) => room.showtimes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: string;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  // numeric columns come back as strings from `pg` — cast on read if needed
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: string;

  @OneToMany(() => Reservation, (reservation) => reservation.showtime)
  reservations: Reservation[];
}
