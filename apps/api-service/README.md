# API Service

Reusable backend service built with NestJS + MongoDB.

Currently includes:
- Forms metadata/template APIs
- Form submission APIs
- Health checks

## Run locally

1. Install dependencies from workspace root:

```sh
pnpm install
```

2. Start MongoDB from workspace root:

```sh
docker compose up -d mongo
```

Or use the direct `docker run` option from the root README.

3. Set environment variable:

```sh
MONGO_URI=mongodb://localhost:27017/api_service
```

If `MONGO_URI` is not set, the service uses the same default value above.

4. Start in dev mode:

```sh
pnpm --filter api-service start:dev
```

## Local URLs

- Base URL: `http://localhost:3002`
- Swagger UI: `http://localhost:3002/api/docs`
- Health check: `http://localhost:3002/`
- Health check (alt): `http://localhost:3002/health`
