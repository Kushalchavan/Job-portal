import { z } from "zod";

export const skillsSchema = z.array(z.string());

export const parsedResumeSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(z.string()),
  education: z.array(z.string()),
  projects: z.array(z.string()),
});

export type ParsedResume = z.infer<typeof parsedResumeSchema>;
