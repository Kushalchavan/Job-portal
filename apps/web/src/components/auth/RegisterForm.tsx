"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  registerSchema,
  RegisterFormData,
} from "@/validations/register.schema";
import { registerUser } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      await registerUser(
        values.name,
        values.email,
        values.password,
        values.role,
      );

      toast.success("Registration successful");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Register</h1>

        <div className="space-y-2">
          <Label>Name</Label>

          <Input placeholder="Enter name" {...register("name")} />

          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Email</Label>

          <Input placeholder="Enter email" {...register("email")} />

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <Input
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />

          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Role</Label>

          <select
            {...register("role")}
            className="w-full rounded-md border p-2"
          >
            <option value="USER">USER</option>
            <option value="RECRUITER">RECRUITER</option>
          </select>

          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
