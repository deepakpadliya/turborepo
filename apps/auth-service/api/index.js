/**
 * Vercel serverless entry — requires that you run `pnpm build` (tsc) so dist/serverless.js exists.
 * Vercel will deploy api/index.js as a serverless function which proxies to the NestJS app handler.
 */
const { handler } = require('../dist/serverless');
module.exports = handler;
