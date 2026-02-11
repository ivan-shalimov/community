import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  // Ensure that environment variables are loaded before accessing them
  await ConfigModule.envVariablesLoaded;

  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
    entities: [],
    // todo consider to use schema validation to to convert string to boolean, for example joy
    synchronize:
      configService.getOrThrow<string>('SCHEMA_SYNCHRONIZE') === 'true',
    autoLoadEntities: true,
  };
};
