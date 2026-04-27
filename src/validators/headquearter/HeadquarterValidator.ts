import { z } from 'zod';

// ─── Params: id de sede ────────────────────────────────────────────────────
export const HeadquarterIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El id debe ser un número válido')
    .transform(Number),
});

export type HeadquarterIdParam = z.infer<typeof HeadquarterIdParamSchema>;