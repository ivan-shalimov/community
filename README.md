

## Description

Commuinity is a service designed to support local communities. 

The initial idea that service will allow to:
* create communities
* invite members to community
* share notices and event schedule
* share member skils and allows to request help
* provide chat functionality

### Project Goals
 * Providing a customized tool for my parents to store and analyze expense data
 * Having a pet project that allows me to test different libraries and approaches in a kind-of-production solution  
 * Creating a portfolio solution to demonstrate my expertise and skills to potential employers

## Project setup

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

All commands should be run within `community-web-api`

```bash
# generate migration 
$ npx typeorm migration:generate -d data-source.ts db/<new migration name> -p

# apply pending migrations 
$ npx typeorm-ts-node-commonjs migration:run -d data-source.ts

# revert the latest migrations 
$ npx typeorm-ts-node-commonjs migration:revert -d data-source.ts
```
