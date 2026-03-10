import { EnvSchema } from './env-schema';
import { AppConfig } from './interfaces';

export const configuration = (): AppConfig => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return {
    secure: {
      jwtSecret: result.data.JWT_SECRET,
      jwtRefreshSecret: result.data.JWT_REFRESH_SECRET,
    },
    common: {
      adminName: result.data.ADMIN_NAME,
      adminEmail: result.data.ADMIN_EMAIL,
      portalUrl: result.data.PORTAL_URL,
      port: result.data.PORT,
    },
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
    },
  };
};
