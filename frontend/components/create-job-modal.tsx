"use client";

import { useEffect, useState } from "react";
import { createJob } from "@/services/job.service";
import { getMyCompanies } from "@/services/company.service";
import { Company } from "@/types/company.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, MapPin, DollarSign, Layers, Building2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateJobModal({ open, onClose, onCreated }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    minSalary: "",
    maxSalary: "",
    minExperience: "",
    maxExperience: "",
    level: "JUNIOR",
    employmentType: "FULL_TIME",
    companyId: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await getMyCompanies();
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    try {
      await createJob({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        minSalary: Number(formData.minSalary),
        maxSalary: Number(formData.maxSalary),
        minExperience: Number(formData.minExperience),
        maxExperience: Number(formData.maxExperience),
        level: formData.level as any,
        employmentType: formData.employmentType as any,
        companyId: Number(formData.companyId),
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create job", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {" "}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Create a new job posting for your company
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Job Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Job Title</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <Input
                name="title"
                placeholder="Frontend Developer"
                value={formData.title}
                onChange={handleChange}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Location</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input
                name="location"
                placeholder="Remote / New York"
                value={formData.location}
                onChange={handleChange}
                className="border-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="minSalary"
              placeholder="Min Salary"
              value={formData.minSalary}
              onChange={handleChange}
            />
            <Input
              name="maxSalary"
              placeholder="Max Salary"
              value={formData.maxSalary}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="minExperience"
              placeholder="Min Experience"
              value={formData.minExperience}
              onChange={handleChange}
            />
            <Input
              name="maxExperience"
              placeholder="Max Experience"
              value={formData.maxExperience}
              onChange={handleChange}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Company</label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="border rounded-lg p-2 bg-background"
            >
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              name="description"
              placeholder="Describe the role..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleCreate}>Create Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
