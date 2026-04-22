import { z } from "zod";

export class OpportunityStateValidator {
    static OpportunityStateIdSchema = z.object({
        id: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser un número entero')
            .positive('debe ser un número positivo'),
    });

    static OpportunityStateSchema = z.object({
        name: z
            .string()
            .min(1, 'es requerido')
            .max(60, 'no puede contener más de 60 caracteres'),

        description: z
            .string()
            .min(1, 'es requerido')
            .max(200, 'no puede contener más de 200 caracteres'),

        color: z
            .string()
            .regex(/^#[0-9A-F]{6}$/i, 'debe ser un color HEX válido (#RRGGBB)'),
    });

    static OpportunityStateUpdateSchema = z.object({
        name: z
            .string()
            .max(60, 'no puede contener más de 60 caracteres')
            .optional(),

        description: z
            .string()
            .max(200, 'no puede contener más de 200 caracteres')
            .optional(),

        color: z
            .string()
            .regex(/^#[0-9A-F]{6}$/i, 'debe ser un color HEX válido (#RRGGBB)')
            .optional(),

        state: z.coerce
            .number()
            .refine((v) => v === 0 || v === 1, 'debe ser 0 o 1')
            .optional(),
    });

    static getOpportunityStatesQuerySchema = z.object({
        search: z.string()
            .optional()
            .transform(val => val?.trim() || undefined),
    });
}

export type OpportunityStateIdPayload = z.infer<typeof OpportunityStateValidator.OpportunityStateIdSchema>;
export type OpportunityStatePayload = z.infer<typeof OpportunityStateValidator.OpportunityStateSchema>;
export type OpportunityStateUpdatePayload = z.infer<typeof OpportunityStateValidator.OpportunityStateUpdateSchema>;
export type GetOpportunityStatesQueryPayload = z.infer<typeof OpportunityStateValidator.getOpportunityStatesQuerySchema>;
