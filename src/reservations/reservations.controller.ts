import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

// TODO once auth module exists: replace userId body/query fields below
// with a @CurrentUser() decorator reading the id off the JWT, and guard
// this whole controller with @UseGuards(JwtAuthGuard)
@ApiTags('reservations')
@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('showtimes/:id/seats')
  @ApiOperation({ summary: 'Get the seat map for a showtime (taken/available)' })
  getSeatMap(@Param('id') showtimeId: string) {
    return this.reservationsService.getSeatMap(showtimeId);
  }

  @Post('reservations')
  @ApiOperation({ summary: 'Reserve one or more seats for a showtime' })
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto.userId, dto.showtimeId, dto.seatIds);
  }

  @Get('reservations/mine')
  @ApiOperation({ summary: "Get the current user's reservations" })
  findMine(@Query('userId') userId: string) {
    return this.reservationsService.findMine(userId);
  }

  @Get('reservations')
  @ApiOperation({ summary: '[Admin] List all reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Patch('reservations/:id/cancel')
  @ApiOperation({ summary: 'Cancel an upcoming reservation' })
  cancel(@Param('id') reservationId: string, @Body('userId') userId: string) {
    return this.reservationsService.cancel(userId, reservationId);
  }
}
