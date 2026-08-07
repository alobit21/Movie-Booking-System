import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { MoviesService } from '../movies/movies.service';
import { RoomsService } from '../rooms/rooms.service';

interface CreateShowtimeInput {
  movieId: string;
  roomId: string;
  startTime: string; // ISO string from client
  price: string;
}

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepo: Repository<Showtime>,
    private readonly moviesService: MoviesService,
    private readonly roomsService: RoomsService,
  ) {}

  // "movies and showtimes for a specific date" — the browse endpoint
  findByDate(date: string): Promise<Showtime[]> {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);
    return this.showtimesRepo.find({
      where: { startTime: Between(dayStart, dayEnd) },
      relations: {movie: true, room: true},
      order: { startTime: 'ASC' },
    });
  }

  async findById(id: string): Promise<Showtime> {
    const showtime = await this.showtimesRepo.findOne({
      where: { id },
      relations: {movie: true, room: true},
    });
    if (!showtime) throw new NotFoundException('Showtime not found');
    return showtime;
  }

  async create(input: CreateShowtimeInput): Promise<Showtime> {
    const movie = await this.moviesService.findById(input.movieId);
    await this.roomsService.findById(input.roomId); // 404s if room doesn't exist

    const startTime = new Date(input.startTime);
    const endTime = new Date(
      startTime.getTime() + movie.durationMinutes * 60_000,
    );

    // app-level overlap guard; swap for a Postgres EXCLUDE constraint later
    // for a race-condition-proof version
    const clash = await this.showtimesRepo.findOne({
      where: [
        { roomId: input.roomId, startTime: LessThan(endTime), endTime: MoreThan(startTime) },
      ],
    });
    if (clash) {
      throw new BadRequestException('Room is already booked for an overlapping time');
    }

    const showtime = this.showtimesRepo.create({
      movieId: input.movieId,
      roomId: input.roomId,
      startTime,
      endTime,
      price: input.price,
    });
    return this.showtimesRepo.save(showtime);
  }

  async remove(id: string): Promise<void> {
    const result = await this.showtimesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Showtime not found');
  }
}
