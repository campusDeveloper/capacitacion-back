import { z } from "zod";

export class CustomerValidator {
    static getCustomersListQuerySchema = z.object({
        name: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        headquarter: z.coerce.number().optional(),
    });

    static changeCustomerTypeSchema = z.object({
        idType: z.number()
    });

    static getCustomerReservationsParamsSchema = z.object({
        idCustomer: z.string()
    });

    static createCustomerCommentSchema = z.object({
        comment: z.string().trim().min(1).max(250)
    });
}