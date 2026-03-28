"use client";

import { useState } from "react";
import { EmploymentType, Job, Level } from "@/types/job.types";
import { Company } from "@/types/company.types";
import { updateJob } from "@/services/job.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  job: Job | null;
  companies: Company[];
  onUpdated: () => void;
}

export default function EditJobModal({
  open,
  onClose,
  job,
  companies,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    minExperience: "",
    maxExperience: "",
    level: Level.JUNIOR,
    employmentType: EmploymentType.FULL_TIME,
    companyId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!job) return;

    try {
      const payload = {
        ...form,
        minSalary: Number(form.minSalary),
        maxSalary: Number(form.maxSalary),
        minExperience: Number(form.minExperience),
        maxExperience: Number(form.maxExperience),
        companyId: Number(form.companyId),
      };

      await updateJob(job.id, payload);

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update job failed", err);
    }
  };

  if (!job) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen && job) {
          setForm({
            title: job.title,
            description: job.description,
            location: job.location,
            level: job.level as Level,
            minSalary: String(job.minSalary),
            maxSalary: String(job.maxSalary),
            minExperience: String(job.minExperience),
            maxExperience: String(job.maxExperience),
            employmentType: job.employmentType as EmploymentType,
            companyId: String(job.companyId),
          });
        }

        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job title"
          />

          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job description"
          />

          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <select name="level" value={form.level} onChange={handleChange}>
            <option value={Level.JUNIOR}>Junior</option>
            <option value={Level.MID}>Mid</option>
            <option value={Level.SENIOR}>Senior</option>
            <option value={Level.LEAD}>Lead</option>
          </select>

          <div className="grid grid-cols-2 gap-2">
            <Input
              name="minSalary"
              value={form.minSalary}
              onChange={handleChange}
              placeholder="Min Salary"
            />
            <Input
              name="maxSalary"
              value={form.maxSalary}
              onChange={handleChange}
              placeholder="Max Salary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              name="minExperience"
              value={form.minExperience}
              onChange={handleChange}
              placeholder="Min Experience"
            />
            <Input
              name="maxExperience"
              value={form.maxExperience}
              onChange={handleChange}
              placeholder="Max Experience"
            />
          </div>

          <select
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value={EmploymentType.FULL_TIME}>Full Time</option>
            <option value={EmploymentType.PART_TIME}>Part Time</option>
            <option value={EmploymentType.CONTRACT}>Contract</option>
            <option value={EmploymentType.INTERNSHIP}>Internship</option>
          </select>

          <select
            name="companyId"
            value={form.companyId}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleUpdate}>Update Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
