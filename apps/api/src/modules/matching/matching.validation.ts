import { z } from "zod";

export const updateMatchStatusSchema = z.object({
  status: z.enum([
    "MATCHED",
    "SHORTLISTED",
    "INTERVIEW",
    "REJECTED",
    "HIRED",
  ]),
});