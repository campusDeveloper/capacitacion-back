import { z } from "zod";

export class CustomerValidator {
    static getCustomersListQuerySchema = z.object({
        name: z.string().optional(),
        date: z.string().optional(),
        headquarter: z.coerce.number().optional(),
    });
}