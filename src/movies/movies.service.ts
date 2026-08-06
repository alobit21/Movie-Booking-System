import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { GenresService } from '../genres/genres.service';

interface CreateMovieInput {
  title: string;
  description?: string;
  posterUrl?: string;
  durationMinutes: number;
  genreIds?: string[];
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepo: Repository<Movie>,
    private readonly genresService: GenresService,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.moviesRepo.find({ relations: ['genres'] });
  }

  async findById(id: string): Promise<Movie> {
    const movie = await this.moviesRepo.findOne({
      where: { id },
      relations: ['genres'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create(input: CreateMovieInput): Promise<Movie> {
    const genres = input.genreIds
      ? await this.genresService.findByIds(input.genreIds)
      : [];
    const movie = this.moviesRepo.create({ ...input, genres });
    return this.moviesRepo.save(movie);
  }

  async update(id: string, input: Partial<CreateMovieInput>): Promise<Movie> {
    const movie = await this.findById(id);
    if (input.genreIds) {
      movie.genres = await this.genresService.findByIds(input.genreIds);
    }
    Object.assign(movie, {
      title: input.title ?? movie.title,
      description: input.description ?? movie.description,
      posterUrl: input.posterUrl ?? movie.posterUrl,
      durationMinutes: input.durationMinutes ?? movie.durationMinutes,
    });
    return this.moviesRepo.save(movie);
  }

  async remove(id: string): Promise<void> {
    const result = await this.moviesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Movie not found');
  }
}
