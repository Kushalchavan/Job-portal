"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createJob } from "@/services/job.service";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateJobForm() {
  const token = useAuthStore((state) => state.accessToken);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createJob(
        {
          title,
          description,
          location,
          minSalary: 20000,
          maxSalary: 50000,
          minExperience: 1,
          maxExperience: 3,
          employmentType: "FULL_TIME",
          level: "JUNIOR",
          companyId: 1,
        },
        token!,
      );
      toast.success("Job created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <Button type="submit">Create Job</Button>
    </form>
  );
}
