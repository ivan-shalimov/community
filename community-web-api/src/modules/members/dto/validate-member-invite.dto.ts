import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const ValidateMemberInviteSchema = z.object({
  token: z.string().nonempty(),
  email: z.email(),
});

export class ValidateMemberInviteDto extends createZodDto(
  ValidateMemberInviteSchema,
) {}
