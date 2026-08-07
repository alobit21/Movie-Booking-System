# Database setup — install & config notes

## 1. Install
    npm install @nestjs/typeorm typeorm pg @nestjs/config dotenv

## 2. Add to your project root
    - .env.example -> copy to `.env`, fill in your real Neon connection strings
    - src/app.module.ts -> replaces your existing one (merge if you've customized it)
    - src/data-source.ts -> new file, used by the TypeORM CLI only

## 3. Add these scripts to package.json
```json
{
  "scripts": {
    "migration:generate": "typeorm-ts-node-commonjs migration:generate -d src/data-source.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d src/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/data-source.ts"
  }
}
```

## 4. First run (development)
With `synchronize: true` (default outside production in app.module.ts),
just start the app — TypeORM creates all tables, enums, and constraints
from your entities automatically:

    npm run start:dev

Check the Neon dashboard's SQL editor afterward — you should see `users`,
`movies`, `genres`, `movie_genres`, `rooms`, `seats`, `showtimes`,
`reservations`, and `reservation_seats` tables.

## 5. Before going to production
Turn `synchronize` off and generate a real migration instead, so schema
changes are reviewable and repeatable:

    npm run migration:generate -- src/migrations/InitSchema
    npm run migration:run

## Common Neon gotchas
- Forgetting `?sslmode=require` (or the `ssl` option here) → connection
  refused with a TLS-related error.
- Using the pooled URL for migrations → some DDL statements fail silently
  or hang under PgBouncer transaction mode. Use DIRECT_URL for the CLI.
- Neon's free tier suspends idle databases — the first query after a
  period of inactivity can take a few seconds while it wakes up. Not a bug.
