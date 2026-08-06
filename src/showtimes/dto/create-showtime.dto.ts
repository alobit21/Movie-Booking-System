import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsUUID } from 'class-validator';

export class CreateShowtimeDto {
  @ApiProperty({ example: 'b3f1c2e4-...' })
  @IsUUID()
  movieId: string;

  @ApiProperty({ example: 'a9c2d5f1-...' })
  @IsUUID()
  roomId: string;

  @ApiProperty({ example: '2026-08-10T19:30:00.000Z' })
  @IsDateString()
  startTime: string;

  // numeric-as-string keeps precision exact for money — validated as a
  // numeric string rather than IsNumber, which can introduce float rounding
  @ApiProperty({ example: '12.50' })
  @IsNumberString()
  price: string;
}
