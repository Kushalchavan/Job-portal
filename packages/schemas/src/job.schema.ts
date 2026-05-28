import { z } from "zod";

const baseJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  location: z.string(),

  minSalary: z.coerce.number().int().nonnegative(),
  maxSalary: z.coerce.number().int().nonnegative(),

  minExperience: z.coerce.number().int().nonnegative(),
  maxExperience: z.coerce.number().int().nonnegative(),

  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),

  level: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD"]),

  companyId: z.coerce.number().int().positive(),
});

export const createJobSchema = baseJobSchema.refine(
  (data) => data.maxSalary >= data.minSalary,
  {
    message: "Max salary must be greater than or equal to min salary",
    path: ["maxSalary"],
  },
);

export const updateJobSchema = baseJobSchema.partial();
