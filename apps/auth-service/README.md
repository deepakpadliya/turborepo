# Auth Service

Authentication and authorization service built with NestJS + MongoDB.

## Run locally

1. Install dependencies from workspace root:

```sh
pnpm install
```

2. Start MongoDB from workspace root:

```sh
docker compose up -d mongo
```

3. Create local env file from example:

```sh
cp apps/auth-service/.env.example apps/auth-service/.env
```

4. Start in dev mode:

```sh
pnpm --filter auth-service start:dev
```

5. (Optional) Seed default admin/roles:

```sh
pnpm --filter auth-service seed
```

## Local URLs

- Base URL: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/`
- Health check (alt): `http://localhost:3000/health`

## Common auth endpoints

- `POST /auth/login`
- `POST /auth/me` (Bearer token)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Notes

- Mongo connection uses `MONGO_URI` and falls back to `mongodb://localhost:27017/auth`.
- This service currently listens on port `3000` in `src/main.ts`.

