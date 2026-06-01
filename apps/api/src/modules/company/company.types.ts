import { z } from "zod";
import { createCompanySchema, updateCompanySchema } from "./company.schema";

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
