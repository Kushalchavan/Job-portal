import * as z from "zod";

// For creating job
export const createJobSchema = z
  .object({
    title: z.string().min(3, "Job title must be atleast 3 characters").trim(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .trim(),
    minSalary: z.coerce
      .number()
      .int()
      .nonnegative("Minimum salary cannot be negative"),
    maxSalary: z.coerce
      .number()
      .int()
      .nonnegative("Maximum salary cannot be negative"),
    location: z.string().min(2, "Minimum 2 characters required"),
    minExperience: z
      .number()
      .int()
      .nonnegative("Minimum Experience cannot be negative"),
    maxExperience: z
      .number()
      .int()
      .nonnegative("Maximum Experience cannot be negative"),
    employmentType: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
      .default("FULL_TIME"),
    companyId: z.coerce.number().int().positive(),
  })
  .refine((data) => data.maxSalary >= data.minSalary, {
    message: "Max salary must be greater than or equal to min salary",
    path: ["maxSalary"],
  })
  .refine((data) => data.maxExperience >= data.minExperience, {
    message: "Max experience must be greater than or equal to min experience",
    path: ["maxExperience"],
  });

// for updating job
export const updateJobSchema = createJobSchema.partial().extend({
  id: z.number().int().positive(),
});
