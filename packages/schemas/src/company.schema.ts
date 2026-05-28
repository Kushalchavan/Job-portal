import { z } from "zod";

const baseCompanySchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  website: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().url().nullable().optional(),
  ),
  location: z.string().min(2),
});

export const createCompanySchema = baseCompanySchema;

export const updateCompanySchema = baseCompanySchema.partial();
