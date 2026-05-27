import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "RECRUITER", "ADMIN"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
