import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'a9c2d5f1-...' })
  @IsUUID()
  showtimeId: string;

  @ApiProperty({ example: ['seat-uuid-1', 'seat-uuid-2'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  seatIds: string[];
}
