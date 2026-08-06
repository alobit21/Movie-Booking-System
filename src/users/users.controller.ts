import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

// TODO once auth module exists: guard this whole controller with
// @UseGuards(JwtAuthGuard, RolesGuard) and @Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/promote')
  promote(@Param('id') id: string) {
    return this.usersService.promoteToAdmin(id);
  }
}
