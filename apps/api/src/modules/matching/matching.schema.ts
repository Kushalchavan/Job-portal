import { z } from "zod";

export const matchResultSchema = z.object({
  score: z.number(),

  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),

  experienceMatch: z.boolean(),
  titleMatch: z.boolean(),

  strengths: z.array(z.string()),
  concerns: z.array(z.string()),

  recommendation: z.enum([
    "INTERVIEW",
    "MAYBE",
    "REJECT",
  ]),

  summary: z.string(),
});