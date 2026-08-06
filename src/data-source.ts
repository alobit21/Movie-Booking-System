// Used only by the TypeORM CLI (migration:generate / migration:run),
// not by the running app — that's app.module.ts's job.
// The CLI runs outside Nest's DI container, so env vars are loaded manually here.

import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  // Direct (non-pooled) connection — migrations run DDL in a single session
  // and don't play well with PgBouncer's transaction pooling mode.
  url: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // migrations own the schema once this file is in play
});
