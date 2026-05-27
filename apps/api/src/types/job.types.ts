import { z } from "zod";
import { createJobSchema, updateJobSchema } from "../validations/job.validation";

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;