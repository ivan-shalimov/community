import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'postgres-container',
  port: 5432,
  username: 'postgres',
  password: 'Password1!',
  database: 'community-dev',
  entities: ['dist/**/entities/*.js'],
  migrations: ['db/*.ts'],
  synchronize: false,
});
