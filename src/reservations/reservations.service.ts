import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { ReservationSeat } from './entities/reservation-seat.entity';
import { Seat } from '../rooms/entities/seat.entity';
import { ShowtimesService } from '../showtimes/showtimes.service';

// Postgres unique_violation error code
const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(ReservationSeat)
    private readonly reservationSeatsRepo: Repository<ReservationSeat>,
    @InjectRepository(Seat)
    private readonly seatsRepo: Repository<Seat>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly showtimesService: ShowtimesService,
  ) {}

  // GET /showtimes/:id/seats — every seat in the room, flagged taken/available
  async getSeatMap(showtimeId: string) {
    const showtime = await this.showtimesService.findById(showtimeId);

    const allSeats = await this.seatsRepo.find({
      where: { roomId: showtime.roomId },
      order: { row: 'ASC', number: 'ASC' },
    });

    const taken = await this.reservationSeatsRepo.find({
      where: { showtimeId },
    });
    const takenSeatIds = new Set(taken.map((rs) => rs.seatId));

    return allSeats.map((seat) => ({
      id: seat.id,
      row: seat.row,
      number: seat.number,
      seatType: seat.seatType,
      available: !takenSeatIds.has(seat.id),
    }));
  }

  // POST /reservations — the concurrency-safe booking flow
  async create(userId: string, showtimeId: string, seatIds: string[]): Promise<Reservation> {
    if (!seatIds?.length) {
      throw new BadRequestException('Select at least one seat');
    }

    const showtime = await this.showtimesService.findById(showtimeId);
    if (showtime.startTime.getTime() <= Date.now()) {
      throw new BadRequestException('Cannot book a showtime that has already started');
    }

    const pricePerSeat = Number(showtime.price);
    const totalPrice = (pricePerSeat * seatIds.length).toFixed(2);

    return this.dataSource.transaction(async (manager) => {
      const reservation = manager.create(Reservation, {
        userId,
        showtimeId,
        status: ReservationStatus.CONFIRMED,
        totalPrice,
      });
      await manager.save(reservation);

      const rows = seatIds.map((seatId) =>
        manager.create(ReservationSeat, {
          reservationId: reservation.id,
          showtimeId,
          seatId,
        }),
      );

      try {
        // the UNIQUE(showtimeId, seatId) constraint is what actually
        // prevents two concurrent requests from double-booking a seat
        await manager.save(rows);
      } catch (err: any) {
        if (err.code === PG_UNIQUE_VIOLATION) {
          throw new ConflictException('One or more selected seats were just taken');
        }
        throw err;
      }

      reservation.seats = rows;
      return reservation;
    });
  }

  findMine(userId: string): Promise<Reservation[]> {
    return this.reservationsRepo.find({
      where: { userId },
      relations: ['showtime', 'showtime.movie', 'seats', 'seats.seat'],
      order: { createdAt: 'DESC' },
    });
  }

  findAll(): Promise<Reservation[]> {
    // admin view — all reservations across all users
    return this.reservationsRepo.find({
      relations: ['user', 'showtime', 'showtime.movie', 'seats'],
      order: { createdAt: 'DESC' },
    });
  }

  // PATCH /reservations/:id/cancel
  async cancel(userId: string, reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationsRepo.findOne({
      where: { id: reservationId },
      relations: ['showtime'],
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }
    if (reservation.status === ReservationStatus.CANCELLED) {
      return reservation;
    }
    if (reservation.showtime.startTime.getTime() <= Date.now()) {
      throw new BadRequestException('Cannot cancel a showtime that already started');
    }

    return this.dataSource.transaction(async (manager) => {
      // Approach B: delete the seat rows to free them immediately;
      // keep the parent Reservation as a cancelled audit record
      await manager.delete(ReservationSeat, { reservationId });
      reservation.status = ReservationStatus.CANCELLED;
      return manager.save(reservation);
    });
  }
}
