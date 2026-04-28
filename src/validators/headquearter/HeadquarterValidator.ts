import { z } from 'zod';

export const HeadquarterIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El id debe ser un número válido')
    .transform(Number),
});

export const HeadquarterListParamSchema = z.object({
  idHeadquarter: z
    .string()
    .refine((val) => val === 'general' || /^\d+$/.test(val), {
      message: 'El idHeadquarter debe ser un número o la palabra "general"',
    }),
});

export const KnowledgeIdParamSchema = z.object({
  idKnowledge: z
    .string()
    .regex(/^\d+$/, 'El idKnowledge debe ser un número válido')
    .transform(Number),
});

export const DocIdParamSchema = z.object({
  idDoc: z
    .string()
    .regex(/^\d+$/, 'El idDoc debe ser un número válido')
    .transform(Number),
});

// --- NUEVOS VALIDADORES PARA CREAR/EDITAR ---

export const CreateKnowledgeSchema = z.object({
  idHeadquarter: z.union([z.number(), z.null()]).optional(), // null para Conocimiento General
  title: z.string().min(1, 'El título es requerido').max(60, 'Máximo 60 caracteres'),
  description: z.string().max(150, 'Máximo 150 caracteres').optional().nullable(),
});

export const UpdateKnowledgeSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(60, 'Máximo 60 caracteres'),
  description: z.string().max(150, 'Máximo 150 caracteres').optional().nullable(),
});

export const CreateDocBodySchema = z.object({
  idKnowledge: z.preprocess((val) => Number(val), z.number({ error: "El idKnowledge es requerido" })),
  name: z.string().min(1, 'El nombre es requerido').max(60, 'Máximo 60 caracteres'),
  // Nota: El archivo físico se valida directamente en el controlador
});

export type HeadquarterIdParam = z.infer<typeof HeadquarterIdParamSchema>;