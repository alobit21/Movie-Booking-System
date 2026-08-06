import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genresRepo: Repository<Genre>,
  ) {}

  findAll(): Promise<Genre[]> {
    return this.genresRepo.find();
  }

  create(name: string): Promise<Genre> {
    const genre = this.genresRepo.create({ name });
    return this.genresRepo.save(genre);
  }

  // helper for MoviesService when attaching genres to a movie
  findByIds(ids: string[]): Promise<Genre[]> {
    return this.genresRepo.findBy({ id: In(ids) });
  }

  remove(id: string): Promise<void> {
    return this.genresRepo.delete(id).then(() => undefined);
  }
}
