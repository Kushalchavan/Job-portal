import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    location: z.string().min(2),
    website: z.string().url().optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    location: z.string().min(2).optional(),
    website: z.string().url().optional().nullable(),
  }),
  params: z.object({
    id: z.string(),
  }),
});
