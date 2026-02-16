import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DatabaseConfig } from './interfaces';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  // Ensure that environment variables are loaded before accessing them
  await ConfigModule.envVariablesLoaded;

  const config = configService.getOrThrow<DatabaseConfig>('database');

  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,
    entities: [],
    synchronize: config.schemaSynchronize,
    autoLoadEntities: true,
  };
};
