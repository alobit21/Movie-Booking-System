import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({ example: 'Sci-Fi' })
  @IsString()
  @MinLength(2)
  name: string;
}
