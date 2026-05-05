import z from "zod";

export const TemplatesValidator = {
  idTemplateSchema: z.object({
    idTemplate: z.coerce.number().int().positive()
  })
};
