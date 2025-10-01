# Auth Service (NestJS) — ready for Turborepo & Vercel (serverless)

This is a ready-to-drop-in authentication microservice built with NestJS, TypeScript, MongoDB (Mongoose), and ready to be deployed as a Vercel serverless function.

How it works:
- Source in `src/`
- Build: `pnpm build` -> compiles `src/` -> `dist/`
- Vercel entrypoint `api/index.js` expects `dist/serverless.js` which exports `handler`

Important:
1. Install dependencies: `pnpm install`
2. Set environment variables from `.env.example` (create `.env`)
3. Run seed to create default admin role & user: `pnpm run seed`
4. Build: `pnpm build`
5. Deploy to Vercel (or run locally `pnpm dev`)

Swagger docs will be available at `/api/docs` when running locally.

Notes about Vercel:
- This project uses a small serverless adapter exported in `src/serverless.ts` and built to `dist/serverless.js`.
- Ensure you run `pnpm build` before deploying so `dist/serverless.js` exists.

