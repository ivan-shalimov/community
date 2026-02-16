import { z } from 'zod';

export const EnvSchema = z.object({
  POSTGRES_HOST: z.string().nonempty(),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().nonempty(),
  POSTGRES_PASSWORD: z.string().nonempty(),
  POSTGRES_DATABASE: z.string().nonempty(),
  SCHEMA_SYNCHRONIZE: z.stringbool(),
});
