import { z } from "zod";

const positiveInteger = z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), { message: "es requerido" })
    .int("debe ser numero entero")
    .positive("debe ser un numero positivo");

export class HeadquarterValidator {
    static UserHeadquartersParamsSchema = z.object({
        idUser: positiveInteger,
    });

    static UpdateMainHeadquarterSchema = z.object({
        idUser: positiveInteger,
        idHeadquarter: positiveInteger,
    });

    static UpdateUserHeadquarterSchema = z.object({
        idUser: positiveInteger,
        idHeadquarter: positiveInteger,
        value: z.coerce
            .number()
            .refine((value) => !Number.isNaN(value), { message: "es requerido" })
            .int("debe ser numero entero")
            .refine((value) => value === 0 || value === 1, { message: "debe ser 0 o 1" }),
    });
}
