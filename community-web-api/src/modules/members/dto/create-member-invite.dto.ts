import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const CreateMemberInviteSchema = z.object({
  name: z.string().nonempty(),
  email: z.email(),
});

export class CreateMemberInviteDto extends createZodDto(
  CreateMemberInviteSchema,
) {}
