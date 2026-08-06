import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiOperation({ summary: 'List all genres' })
  findAll() {
    return this.genresService.findAll();
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Post()
  @ApiOperation({ summary: '[Admin] Create a genre' })
  create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto.name);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a genre' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
