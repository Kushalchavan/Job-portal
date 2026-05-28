import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z.coerce.number().int().positive("Job ID must be a positive number"),
  resumeUrl: z.string().url("Invalid resume URL").optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});