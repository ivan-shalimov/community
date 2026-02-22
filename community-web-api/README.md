## Description

Community-Web-API is a backend service for the Community platform. Built with NestJS, TypeScript, and PostgreSQL, it provides REST API endpoints for community management, member invitations, and related functionality.

## Project setup

Create a `.env` file in the `community-web-api` directory with the required environment variables:

### Environment Variables

| Variable             | Description                          | Example Value                                  |
| -------------------- | ------------------------------------ | ---------------------------------------------- |
| `NODE_ENV`           | Application environment              | `development`, `production`, `test`            |
| `PORT`               | Application port                     | `3000`                                         |
| `POSTGRES_HOST`      | PostgreSQL server host               | `localhost` or `postgres-container`            |
| `POSTGRES_PORT`      | PostgreSQL server port               | `5432`                                         |
| `POSTGRES_USER`      | PostgreSQL username                  | `postgres`                                     |
| `POSTGRES_PASSWORD`  | PostgreSQL password                  | `Password1!`                                   |
| `POSTGRES_DATABASE`  | PostgreSQL database name             | `community-dev`                                |
| `SCHEMA_SYNCHRONIZE` | Auto-sync database schema | `false` for production/development, `true` for E2E tests only |

### Install packages

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## DB migration

```bash
# generate migration
$ migration:add

# apply pending migrations
$ migration:run

# revert the latest migrations
$ migration:revert
```
