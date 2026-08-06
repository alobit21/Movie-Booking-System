import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Dune: Part Two' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Paul Atreides unites with the Fremen...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/posters/dune2.jpg' })
  @IsOptional()
  @IsUrl()
  posterUrl?: string;

  @ApiProperty({ example: 166, description: 'Runtime in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiPropertyOptional({
    example: ['b3f1...', 'a9c2...'],
    description: 'Genre IDs to attach to this movie',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  genreIds?: string[];
}
