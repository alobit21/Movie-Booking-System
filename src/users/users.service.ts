import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // used by auth module — needs the passwordHash, which is select:false by default
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ id });
  }

  create(email: string, passwordHash: string, role: UserRole = UserRole.USER): Promise<User> {
    const user = this.usersRepo.create({ email, passwordHash, role });
    return this.usersRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async promoteToAdmin(id: string): Promise<User> {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    user.role = UserRole.ADMIN;
    return this.usersRepo.save(user);
  }
}
