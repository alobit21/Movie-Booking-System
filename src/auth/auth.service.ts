import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmailWithPassword(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    // signup always creates a regular user — becoming admin only happens
    // via PATCH /users/:id/promote, which is itself admin-only
    const user = await this.usersService.create(email, passwordHash, UserRole.USER);
    return this.buildToken(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildToken(user.id, user.email, user.role);
  }

  private buildToken(sub: string, email: string, role: string) {
    const accessToken = this.jwtService.sign({ sub, email, role });
    return { accessToken };
  }
}
