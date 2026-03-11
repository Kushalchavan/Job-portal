import * as z from "zod";

const baseJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  minSalary: z.coerce.number().int().nonnegative(),
  maxSalary: z.coerce.number().int().nonnegative(),
  location: z.string(),
  minExperience: z.coerce.number().int().nonnegative(),
  maxExperience: z.coerce.number().int().nonnegative(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  level: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD"]),
  companyId: z.coerce.number().int().positive(),
});

// for creting job
export const createJobSchema = baseJobSchema
  .refine((data) => data.maxSalary >= data.minSalary, {
    message: "Max salary must be greater than or equal to min salary",
    path: ["maxSalary"],
  })
  .refine((data) => data.maxExperience >= data.minExperience, {
    message: "Max experience must be greater than or equal to min experience",
    path: ["maxExperience"],
  });

// for updating job
export const updateJobSchema = baseJobSchema.partial().extend({
  id: z.number().int().positive(),
});
