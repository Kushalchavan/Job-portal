import { ApplicationStatus } from "@prisma/client";
import * as z from "zod";

export const applyJobSchema = z.object({
  jobId: z.coerce.number().int().positive("Job ID must be a positive number"),

  resumeUrl: z.string().url("Resume must be a valid URL").optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});
