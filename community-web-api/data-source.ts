import { DataSource } from 'typeorm';

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT_ENV = process.env.POSTGRES_PORT;
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;

if (!POSTGRES_HOST) {
  throw new Error('Environment variable POSTGRES_HOST must be defined');
}

if (!POSTGRES_PORT_ENV) {
  throw new Error('Environment variable POSTGRES_PORT must be defined');
}

const POSTGRES_PORT = Number(POSTGRES_PORT_ENV);

if (!Number.isInteger(POSTGRES_PORT) || POSTGRES_PORT <= 0) {
  throw new Error('Environment variable POSTGRES_PORT must be a positive integer');
}

if (!POSTGRES_USER) {
  throw new Error('Environment variable POSTGRES_USER must be defined');
}

if (!POSTGRES_PASSWORD) {
  throw new Error('Environment variable POSTGRES_PASSWORD must be defined');
}

if (!POSTGRES_DATABASE) {
  throw new Error('Environment variable POSTGRES_DATABASE must be defined');
}

export default new DataSource({
  type: 'postgres',

  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,

  entities: ['dist/**/entities/*.js'],
  migrations: ['db/*.ts'],
});
