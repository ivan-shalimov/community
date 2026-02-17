import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  // database configuration
  POSTGRES_HOST: z.string().nonempty(),
  POSTGRES_PORT: z.coerce.number().min(1).max(65535),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_DATABASE: z.string().nonempty(),
  SCHEMA_SYNCHRONIZE: z.stringbool(),
  // mailer configuration
  MAILER_HOST: z.string().nonempty(),
  MAILER_PORT: z.coerce.number().min(1).max(65535),
  MAILER_ADMIN_NAME: z.string().nonempty(),
  MAILER_ADMIN_EMAIL: z.email(),
});
