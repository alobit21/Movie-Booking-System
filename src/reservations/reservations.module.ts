import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';
import { Seat } from '../rooms/entities/seat.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservationSeat, Seat]),
    ShowtimesModule,
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
