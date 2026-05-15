import { z } from "zod";

export class OpportunityValidator {
  static getListQuerySchema = z.object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().min(1).optional(),
  });
}