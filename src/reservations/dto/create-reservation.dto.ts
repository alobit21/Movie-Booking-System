import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class CreateReservationDto {
  // TODO: drop userId once auth exists — it'll come from the JWT instead
  @ApiProperty({ example: 'f4e1...' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'a9c2d5f1-...' })
  @IsUUID()
  showtimeId: string;

  @ApiProperty({ example: ['seat-uuid-1', 'seat-uuid-2'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  seatIds: string[];
}
