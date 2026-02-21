import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const UpdateMemberNameSchema = z.object({
  name: z.string().min(1),
});

export class UpdateMemberNameDto extends createZodDto(UpdateMemberNameSchema) {}
