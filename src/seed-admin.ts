// Run once via: npm run seed:admin
// Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env — set them before running.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before seeding.');
    await app.close();
    process.exit(1);
  }

  const existing = await usersService.findByEmailWithPassword(email);
  if (existing) {
    console.log(`Admin ${email} already exists — skipping.`);
    await app.close();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await usersService.create(email, passwordHash, UserRole.ADMIN);
  console.log(`Admin user ${email} created.`);
  await app.close();
}

seed();
