import { z } from "zod";

export const UsersPermissionsValidator  = z.object({
    idUser: z.number().optional(),
    module: z.number().min(1).max(7).optional(),
    value: z.union([z.literal(0), z.literal(1)]),
});