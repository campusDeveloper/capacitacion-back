import { z } from "zod";

const hexColorRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const requiredNumber = (field = "es requerido") =>
    z.coerce
        .number()
        .refine((v) => !Number.isNaN(v), { message: field })
        .int("debe ser un número entero")
        .positive("debe ser un número positivo");

const requiredName = z
    .string()
    .trim()
    .min(1, "es requerido")
    .max(40, "no puede superar 40 caracteres");

const requiredColor = z
    .string()
    .trim()
    .min(1, "es requerido")
    .refine((value) => hexColorRegex.test(value), {
        message: "debe ser hexadecimal válido",
    });

const subStateSchema = z.object({
    name: requiredName,
    color: requiredColor,
});

export class OpportunityTrackingValidators {
    static ParentIdSchema = z.object({
        idTracking: requiredNumber(),
    });

    static ChildIdSchema = z.object({
        idTracking: requiredNumber(),
    });

    static ParentAndChildIdSchema = z.object({
        idTracking: requiredNumber(),
        idChild: requiredNumber(),
    });

    static ChildrenByParentSchema = z.object({
        parentId: requiredNumber(),
    });

    static StoreParentSchema = z.object({
        name: requiredName,
        color: requiredColor,
        sub: z.array(subStateSchema).optional().default([]),
    });

    static UpdateParentSchema = z.object({
        idTracking: requiredNumber(),
        name: requiredName,
        color: requiredColor,
    });

    static StoreSubStateSchema = z.object({
        idTracking: requiredNumber(),
        name: requiredName,
        color: requiredColor,
    });

    static UpdateSubStateSchema = z.object({
        idTracking: requiredNumber(),
        name: requiredName,
        color: requiredColor,
    });

    static DeleteSubStateSchema = z.object({
        idTracking: requiredNumber(),
        idChild: requiredNumber(),
    });

    static StoreChildSchema = z.object({
        name: requiredName,
        color: requiredColor,
        idOpportunityTracking: requiredNumber(),
    });

    static UpdateChildSchema = z.object({
        idTracking: requiredNumber(),
        name: requiredName,
        color: requiredColor,
    });
}

