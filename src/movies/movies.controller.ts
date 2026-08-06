import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'List all movies with their genres' })
  @ApiResponse({ status: 200, description: 'Array of movies' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single movie by id' })
  @ApiParam({ name: 'id', description: 'Movie UUID' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findById(id);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Post()
  @ApiOperation({ summary: '[Admin] Create a movie' })
  @ApiResponse({ status: 201, description: 'Movie created' })
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update a movie' })
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto);
  }

  // TODO: guard with @Roles('admin') once auth module exists
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
