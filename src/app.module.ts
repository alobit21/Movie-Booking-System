import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { MoviesModule } from './movies/movies.module';
import { RoomsModule } from './rooms/rooms.module';
import { ShowtimesModule } from './showtimes/showtimes.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    // isGlobal so ConfigService is injectable anywhere without re-importing
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        // Neon requires SSL; rejectUnauthorized:false skips CA verification,
        // which is the common approach for serverless PG providers in dev.
        // For stricter prod setups, supply Neon's CA cert instead.
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true, // picks up every entity registered via forFeature()
        // NEVER true in production — synchronize auto-alters your schema
        // to match entities on every boot, which is fine for local dev but
        // dangerous once real data exists. Switch to migrations before prod.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),

    UsersModule,
    GenresModule,
    MoviesModule,
    RoomsModule,
    ShowtimesModule,
    ReservationsModule,
  ],
})
export class AppModule {}