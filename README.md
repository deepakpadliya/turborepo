# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/auth-utils`: shared authentication utilities for the monorepo
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

## Local MongoDB with Docker

Run MongoDB locally for services that need `MONGO_URI` (for example, `api-service`):

### One-click from README (VS Code)

Open this README in Markdown Preview and click:

- [Start MongoDB](command:workbench.action.tasks.runTask?%22Mongo%3A%20Up%22)
- [Stop MongoDB](command:workbench.action.tasks.runTask?%22Mongo%3A%20Down%22)
- [View Mongo logs](command:workbench.action.tasks.runTask?%22Mongo%3A%20Logs%22)

If command links are blocked, trust the workspace and allow command links in Markdown.

1. Start MongoDB with Docker Compose:

```sh
docker compose up -d mongo
```

2. Verify it is running:

```sh
docker compose ps
```

3. Use this connection string in your app env:

```sh
MONGO_URI=mongodb://localhost:27017/api_service
```

Alternative (direct Docker command):

```sh
docker run -d \
	--name turbo-mongo \
	-p 27017:27017 \
	-v turbo-mongo-data:/data/db \
	mongo:7
```

Useful commands:

```sh
# stop compose service
docker compose stop mongo

# start compose service again
docker compose start mongo

# remove compose service containers
docker compose down

# stop
docker stop turbo-mongo

# start again
docker start turbo-mongo

# remove container (data stays in named volume unless deleted)
docker rm -f turbo-mongo

# delete persisted data volume
docker volume rm turbo-mongo-data
```
