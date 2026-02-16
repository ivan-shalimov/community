import { EnvSchema } from './env-schema';
import { AppConfig } from './interfaces';

export default (): AppConfig => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return {
    database: {
      host: result.data.POSTGRES_HOST,
      port: result.data.POSTGRES_PORT,
      user: result.data.POSTGRES_USER,
      password: result.data.POSTGRES_PASSWORD,
      database: result.data.POSTGRES_DATABASE,
      schemaSynchronize: result.data.SCHEMA_SYNCHRONIZE,
    },
  };
};
