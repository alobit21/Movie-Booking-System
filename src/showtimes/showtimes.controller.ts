import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';

@ApiTags('showtimes')
@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get()
  @ApiOperation({ summary: 'Browse showtimes for a given date' })
  @ApiQuery({ name: 'date', example: '2026-08-10', description: 'YYYY-MM-DD' })
  findByDate(@Query('date') date: string) {
    return this.showtimesService.findByDate(date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single showtime' })
  findOne(@Param('id') id: string) {
    return this.showtimesService.findById(id);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Post()
  @ApiOperation({ summary: '[Admin] Schedule a showtime' })
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimesService.create(dto);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Remove a showtime' })
  remove(@Param('id') id: string) {
    return this.showtimesService.remove(id);
  }
}
