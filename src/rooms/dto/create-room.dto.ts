import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Screen 1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 8, description: 'Number of rows (A, B, C...)' })
  @IsInt()
  @Min(1)
  @Max(26)
  rows: number;

  @ApiProperty({ example: 10, description: 'Seats per row' })
  @IsInt()
  @Min(1)
  seatsPerRow: number;
}
