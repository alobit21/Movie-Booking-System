import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { MoviesModule } from '../movies/movies.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime]), MoviesModule, RoomsModule],
  providers: [ShowtimesService],
  controllers: [ShowtimesController],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
