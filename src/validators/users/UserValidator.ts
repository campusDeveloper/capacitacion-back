import { z } from "zod";


export class UserValidator {

    static UserIdSchema = z.object({
        idUser: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser un número entero')
            .positive('debe ser un número positivo'),
    });

    static UserSchema = z.object({
        type: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        name: z
            .string()
            .min(1, 'es requerido')
            .max(60, 'no puede contener más de 60 caracteres'),

        email: z
            .string()
            .min(1, 'es requerido')
            .max(100, 'no puede contener más de 100 caracteres'),

        password: z
            .string()
            .min(1, 'es requerido')
            .max(120, 'no puede contener más de 120 caracteres'),

        mainHeadquarter: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        specialAgent: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        paymentAgent: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        headquarters: z
            .array(
                z.coerce
                    .number()
                    .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
                    .int('debe ser número entero')
            )
            .optional(),

    });
    static UserUpdateSchema = z.object({
        type: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        name: z
            .string()
            .min(1, 'es requerido')
            .max(60, 'no puede contener más de 60 caracteres'),

        email: z
            .string()
            .min(1, 'es requerido')
            .max(100, 'no puede contener más de 100 caracteres'),

        password: z
            .string()
            .max(120, 'no puede contener más de 120 caracteres')
            .optional(),

        mainHeadquarter: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        specialAgent: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        paymentAgent: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),
    });
    static UserHeadUpdateSchema = z.object({
        idHeadquarter: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),
    });
    static UserSubHeadUpdateSchema = z.object({
        idHeadquarter: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),

        value: z.coerce
            .number()
            .refine((v) => !Number.isNaN(v), { message: 'es requerido' })
            .int('debe ser número entero'),
    });

    static getUserQuerySchema = z.object({
        userType: z.coerce.number().optional(),
        search: z.string()
            .optional()
            .transform(val => val?.trim() || undefined),
    });
}

export type GetUsersQueryPayload = z.infer<typeof UserValidator.getUserQuerySchema>;

