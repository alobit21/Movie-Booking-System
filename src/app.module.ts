import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Auth,users,movies,genres,rooms,showtimes,showtimes,reservation,reportsModule } from './auth,users,movies,genres,rooms,showtimes,showtimes,reservation,reports/auth,users,movies,genres,rooms,showtimes,showtimes,reservation,reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { GenresModule } from './genres/genres.module';
import { RoomsModule } from './rooms/rooms.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { ReservationModule } from './reservation/reservation.module';
import { ReportsModule } from './reports/reports.module';
import { TestsModule } from './tests/tests.module';

@Module({
  imports: [Auth,users,movies,genres,rooms,showtimes,showtimes,reservation,reportsModule, AuthModule, UsersModule, MoviesModule, GenresModule, RoomsModule, ShowtimesModule, ReservationModule, ReportsModule, TestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
