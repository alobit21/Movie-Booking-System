import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../../genres/entities/genre.entity';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  posterUrl: string;

  // needed to compute Showtime.endTime = startTime + durationMinutes
  @Column({ type: 'int' })
  durationMinutes: number;

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: ['insert'] })
  @JoinTable({
    name: 'movie_genres',
    joinColumn: { name: 'movieId' },
    inverseJoinColumn: { name: 'genreId' },
  })
  genres: Genre[];

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
