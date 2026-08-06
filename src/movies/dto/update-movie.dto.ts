import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';

// PartialType makes every field optional while keeping all validation
// rules and @ApiProperty metadata from CreateMovieDto — one DTO, no duplication
export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
