import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const RegisterMemberSchema = z.object({
  token: z.string().nonempty(),
  name: z.string().nonempty(),
  email: z.email(),
});

export class RegisterMemberDto extends createZodDto(RegisterMemberSchema) {}
