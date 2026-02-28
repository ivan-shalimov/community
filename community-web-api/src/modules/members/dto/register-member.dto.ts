import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(20, { message: 'Password must be less than 20 characters' })
  .regex(/[A-Z]/, { message: 'Must contain one uppercase letter' })
  .regex(/[a-z]/, { message: 'Must contain one lowercase letter' })
  .regex(/[0-9]/, { message: 'Must contain one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Must contain one special character' });

export const RegisterMemberSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  password: passwordSchema,
});

export class RegisterMemberDto extends createZodDto(RegisterMemberSchema) {}
