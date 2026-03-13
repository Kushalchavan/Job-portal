"use client";

import { useState } from "react";
import { Company } from "@/types/company.types";
import { updateCompany } from "@/services/company.service";
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
  company: Company | null;
  onUpdated: () => void;
}

export default function EditCompanyModal({
  open,
  onClose,
  company,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    name: company?.name || "",
    location: company?.location || "",
    website: company?.website || "",
    description: company?.description || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!company) return;

    try {
      await updateCompany(company.id, form);

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update company failed", err);
    }
  };

  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Company name"
          />

          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <Input
            name="website"
            value={form.website || ""}
            onChange={handleChange}
            placeholder="Website"
          />

          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleUpdate}>Update Company</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
