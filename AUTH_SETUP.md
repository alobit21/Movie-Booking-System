# Auth module setup

## 1. Install
    npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
    npm install -D @types/passport-jwt @types/bcrypt

## 2. Env vars
Already in `.env.example`:
    JWT_SECRET=...        # use `openssl rand -hex 32` for a real value
    JWT_EXPIRES_IN=1d
    ADMIN_EMAIL=...
    ADMIN_PASSWORD=...

## 3. Add this script to package.json
```json
"seed:admin": "ts-node -r tsconfig-paths/register src/seed-admin.ts"
```
(or `ts-node src/seed-admin.ts` if you're not using tsconfig-paths)

Run once after your first `npm run start:dev` boot creates the tables:
    npm run seed:admin

## How the pieces fit together

- `POST /auth/signup` — anyone can call this, always creates role `user`
- `POST /auth/login` — returns `{ accessToken }`
- Every protected route now reads the JWT via `JwtAuthGuard`, which populates
  `request.user` with `{ id, email, role }` from the token payload
- `@CurrentUser()` pulls that off the request — no more raw `userId` in
  request bodies for reservations
- `@Roles('admin')` + `RolesGuard` restrict specific routes to admins;
  browsing endpoints (GET movies/genres/rooms/showtimes, seat map) stay public
- Promote a user to admin via `PATCH /users/:id/promote` — only an existing
  admin can call it, which is why the seed script exists (to create the
  very first one)

## Testing in Swagger UI
1. `POST /auth/signup` with an email/password
2. Copy the `accessToken` from the response
3. Click the **Authorize** 🔒 button at the top of `/api/docs`, paste the
   token (no `Bearer ` prefix needed — Swagger adds it)
4. Every guarded endpoint now sends the token automatically
