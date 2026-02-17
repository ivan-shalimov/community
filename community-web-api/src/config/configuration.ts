import { EnvSchema } from './env-schema';
import { AppConfig } from './interfaces';

export const configuration = (): AppConfig => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return {
    port: result.data.PORT,
    database: {
      host: result.data.POSTGRES_HOST,
      port: result.data.POSTGRES_PORT,
      user: result.data.POSTGRES_USER,
      password: result.data.POSTGRES_PASSWORD,
      database: result.data.POSTGRES_DATABASE,
      schemaSynchronize: result.data.SCHEMA_SYNCHRONIZE,
    },
    mailer: {
      host: result.data.MAILER_HOST,
      port: result.data.MAILER_PORT,
      adminName: result.data.MAILER_ADMIN_NAME,
      adminEmail: result.data.MAILER_ADMIN_EMAIL,
    },
  };
};
