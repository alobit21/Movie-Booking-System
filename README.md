# 🎬 Movie Reservation API

NestJS REST API behind the [Movie Reservation frontend](https://github.com/alobit21/MovieBS-FullStack). Handles auth, movies, rooms and seats, showtimes and concurrency-safe seat reservations.

## Highlights

- **JWT auth** with role guards (`USER` / `ADMIN`) via Passport
- **Concurrency-safe booking:** reservations and seats are written in one database transaction, and a unique constraint on seat + showtime means two people can't take the same seat (Postgres `23505` is returned as a conflict)
- **Validation everywhere:** global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`, DTOs with `class-validator`
- **Swagger docs** at `/api/docs`
- Modules: `auth`, `users`, `movies`, `genres`, `rooms` (+ seats), `showtimes`, `reservations`

## Tech Stack

NestJS · TypeScript · TypeORM · PostgreSQL · Passport-JWT · bcrypt · Swagger

## Getting Started

```bash
git clone https://github.com/alobit21/Movie-Booking-System.git
cd Movie-Booking-System
npm install
```

Create `.env`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/movies
DIRECT_URL=postgresql://user:pass@localhost:5432/movies   # used by the TypeORM data source
JWT_SECRET=<random string>
JWT_EXPIRES_IN=1d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<choose one>
PORT=3000
```

```bash
npm run seed:admin   # create the first admin user
npm run start:dev    # http://localhost:3000, docs at /api/docs
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run start:dev` | Watch mode |
| `npm run build` / `start:prod` | Production build and run |
| `npm run test` / `test:e2e` | Unit / end-to-end tests |
| `npm run seed:admin` | Create admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

## Author

**Aloyce Mtavangu**: [Portfolio](https://mac.tarxemo.com) · [LinkedIn](https://www.linkedin.com/in/aloyce-mtavangu-5932652a0)
