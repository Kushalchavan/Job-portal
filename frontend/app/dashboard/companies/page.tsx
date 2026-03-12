"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Globe,
  Plus,
  Eye,
  Briefcase,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { createCompany, getMyCompanies } from "@/services/company.service";
import { Company } from "@/types/company.types";

interface CreateCompanyForm {
  name: string;
  location: string;
  website: string;
  description: string;
  logo: string | null;
}

export default function CompaniesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCompanyForm>({
    name: "",
    location: "",
    website: "",
    description: "",
    logo: null,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getMyCompanies();
        setCompanies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateCompany = async () => {
    if (!formData.name || !formData.location) return;

    try {
      await createCompany({
        name: formData.name,
        location: formData.location,
        website: formData.website,
        description: formData.description,
      });

      // refresh companies list
      const updated = await getMyCompanies();
      setCompanies(updated);

      // reset form
      setFormData({
        name: "",
        location: "",
        website: "",
        description: "",
        logo: null,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create company", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Companies</h1>
            <p className="mt-2 text-muted-foreground">
              Manage companies you recruit for
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Company
          </Button>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Card
                key={company.id}
                className="flex flex-col border border-border transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                <div className="flex flex-1 flex-col gap-4 p-6">
                  {/* Logo */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-sm font-semibold text-accent">
                      {company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {company.name}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {company.location}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>

                  {/* Active Jobs Badge */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {0} active jobs
                    </span>
                  </div>

                  {/* Website */}
                  {company.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-accent hover:underline"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-border p-4">
                  <Link href={`/companies/${company.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Company
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/jobs?company=${company.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Manage Jobs
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border border-border p-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                <Building2 className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  No companies yet
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Create your first company to start managing job postings
                </p>
              </div>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first company
              </Button>
            </div>
          </Card>
        )}

        {/* Create Company Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Company</DialogTitle>
              <DialogDescription>
                Add a new company to your recruitment profile
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Company Name
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <Input
                    name="name"
                    placeholder="Acme Corporation"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Location
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    name="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Website
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Company Description
                </label>
                <Textarea
                  name="description"
                  placeholder="Tell us about your company..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground"
                  rows={3}
                />
              </div>

              {/* Logo Upload (Optional) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Company Logo (Optional)
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border bg-card/50 px-4 py-6 transition hover:border-accent/50 hover:bg-accent/5">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload logo
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData((prev) => ({
                          ...prev,
                          logo: e.target.files![0].name,
                        }));
                      }
                    }}
                  />
                </label>
                {formData.logo && (
                  <p className="text-xs text-accent">
                    Logo selected: {formData.logo}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleCreateCompany}
                disabled={!formData.name || !formData.location}
              >
                Create Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
