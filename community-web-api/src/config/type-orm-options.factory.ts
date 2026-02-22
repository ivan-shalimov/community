import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { IDatabaseConfig } from './interfaces';

export const typeOrmOptionsFactory = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  // Ensure that environment variables are loaded before accessing them
  await ConfigModule.envVariablesLoaded;

  const config = configService.getOrThrow<IDatabaseConfig>('database');

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
