import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const UpdateMemberNameSchema = z.object({
  name: z.string().nonempty(),
});

export class UpdateMemberNameDto extends createZodDto(UpdateMemberNameSchema) {}
