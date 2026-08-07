import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as currentUserDecorator from '../auth/decorators/current-user.decorator';

@ApiTags('reservations')
@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // public — seeing which seats are free doesn't require an account
  @Get('showtimes/:id/seats')
  @ApiOperation({ summary: 'Get the seat map for a showtime (taken/available)' })
  getSeatMap(@Param('id') showtimeId: string) {
    return this.reservationsService.getSeatMap(showtimeId);
  }

  @Post('reservations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reserve one or more seats for a showtime' })
  create(@currentUserDecorator.CurrentUser() user: currentUserDecorator.CurrentUserPayload, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.id, dto.showtimeId, dto.seatIds);
  }

  @Get('reservations/mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get the current user's reservations" })
  findMine(@currentUserDecorator.CurrentUser() user: currentUserDecorator.CurrentUserPayload) {
    return this.reservationsService.findMine(user.id);
  }

  @Get('reservations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '[Admin] List all reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Patch('reservations/:id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel an upcoming reservation' })
  cancel(@Param('id') reservationId: string, @currentUserDecorator.CurrentUser() user: currentUserDecorator.CurrentUserPayload) {
    return this.reservationsService.cancel(user.id, reservationId);
  }
}
