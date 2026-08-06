import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'List all rooms' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a room with its seat layout' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Post()
  @ApiOperation({ summary: '[Admin] Create a room and auto-generate its seat grid' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }
}
