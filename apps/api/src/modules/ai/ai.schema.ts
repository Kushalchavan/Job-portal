import { z } from "zod";

export const parsedResumeSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  projects: z.array(z.string()),
});