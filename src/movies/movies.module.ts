import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { GenresModule } from '../genres/genres.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), GenresModule],
  providers: [MoviesService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
