import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const RegisterMemberSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
});

export class RegisterMemberDto extends createZodDto(RegisterMemberSchema) {}
