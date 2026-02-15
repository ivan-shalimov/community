import { createZodDto } from 'nestjs-zod';
import * as z from 'zod';

export const ListOptionsSchema = z.object({
  page: z.coerce.number().int().nonnegative().max(1000).default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(15),
});

export class ListOptionsDto extends createZodDto(ListOptionsSchema) {}
