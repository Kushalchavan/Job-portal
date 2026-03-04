import { z } from "zod";

const baseCompanySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  website: z.string().url().nullable().optional(),
  location: z.string().min(2),
});

export const createCompanySchema = baseCompanySchema;

export const updateCompanySchema = baseCompanySchema
  .partial()
  .extend({
    id: z.coerce.number().int().positive(),
  });