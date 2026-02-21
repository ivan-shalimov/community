import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const ValidateMemberInviteSchema = z.object({
  token: z.string().min(1),
  email: z.email(),
});

export class ValidateMemberInviteDto extends createZodDto(
  ValidateMemberInviteSchema,
) {}
