import { z } from "zod";


export class CustomerTypeValidator {

    static idTypeSchema = z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), { message: "es requerido" })
    .int("debe ser un numero entero")
    .positive("debe ser un numero positivo");

    static stateSchema = z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), { message: "es requerido" })
    .int("debe ser un numero entero")
    .refine((value) => value === 0 || value === 1, {
        message: "debe ser 0 o 1",
    });

    static customerTypeIdSchema = z.object({
        idType: CustomerTypeValidator.idTypeSchema,
    });

    static createCustomerTypeSchema = z.object({
        name: z
            .string()
            .trim()
            .min(1, "es requerido")
            .max(70, "no puede contener mas de 70 caracteres"),
        description: z
            .string()
            .trim()
            .min(1, "es requerido")
            .max(300, "no puede contener mas de 300 caracteres"),
        color: z
            .string()
            .trim()
            .min(1, "es requerido")
            .max(10, "no puede contener mas de 10 caracteres"),
    });

    static updateCustomerTypeSchema = CustomerTypeValidator.createCustomerTypeSchema.extend({
        idType: CustomerTypeValidator.idTypeSchema,
    });

    static updateCustomerTypeStateSchema = z.object({
        idType: CustomerTypeValidator.idTypeSchema,
        state: CustomerTypeValidator.stateSchema,
    });
}

export type CreateCustomerTypePayload = z.infer<typeof CustomerTypeValidator.createCustomerTypeSchema>;
export type UpdateCustomerTypePayload = z.infer<typeof CustomerTypeValidator.updateCustomerTypeSchema>;
export type UpdateCustomerTypeStatePayload = z.infer<typeof CustomerTypeValidator.updateCustomerTypeStateSchema>;
