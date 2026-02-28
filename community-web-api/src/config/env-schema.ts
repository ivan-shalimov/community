import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  ADMIN_NAME: z.string().min(1),
  ADMIN_EMAIL: z.email(),
  PORTAL_URL: z.url(),
  // database configuration
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().min(1).max(65535),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DATABASE: z.string().min(1),
  SCHEMA_SYNCHRONIZE: z.stringbool(),
  // mailer configuration
  MAILER_HOST: z.string().min(1),
  MAILER_PORT: z.coerce.number().min(1).max(65535),

  // Secure
  JWT_SECRET: z.string().min(32),
});
