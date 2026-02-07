

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
$ npx typeorm migration:generate -d dist/data-source.js db/<new migration name> -p

# apply pending migrations 
$ npx typeorm-ts-node-commonjs migration:run -d dist/data-source.js

# revert the latest migrations 
$ npx typeorm-ts-node-commonjs migration:revert -d dist/data-source.js
```

## Business flows

What to do if member leave community?

* Each instance of Community portal should have own Portal Admin
* The Portal Admin creates a new community
* The Portal Admin becomes an Community admin for the community
* Portal Admin Invite a new Member to the community
* The member accept invitation and fill contact information
* The Portal Admin assigns the member as Community admin
* The community admin invites a new member