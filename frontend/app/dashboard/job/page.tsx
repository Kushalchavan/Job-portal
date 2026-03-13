"use client";

import { useEffect, useState } from "react";
import { Job } from "@/types/job.types";
import { Company } from "@/types/company.types";
import { getJobs, deleteJob } from "@/services/job.service";
import { getMyCompanies } from "@/services/company.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import CreateJobModal from "@/components/create-job-modal";

export default function JobsDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, companiesData] = await Promise.all([
          getJobs(),
          getMyCompanies(),
        ]);

        setJobs(jobsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteJob(id);

      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Failed to delete job", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {" "}
        <p className="text-muted-foreground">Loading jobs...</p>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Manage Jobs</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage job postings
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-accent text-accent-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Job
          </Button>
        </div>
        {/* Jobs List */}
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="border border-border p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {job.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    {job.company?.name}
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    {job.location}
                  </p>

                  <p className="text-xs text-muted-foreground mt-2">
                    {job.employmentType}
                  </p>
                </div>

                <div className="flex gap-2 mt-6">
                  <Link href={`/jobs/${job.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>

                  <Link href={`/dashboard/jobs/${job.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      View Applicants
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center bg-accent/10 rounded-full">
                <Briefcase className="w-10 h-10 text-accent" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  No jobs yet
                </h3>
                <p className="text-muted-foreground mt-1">
                  Create your first job posting
                </p>
              </div>

              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-accent text-accent-foreground mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </Card>
        )}
      </div>
      <CreateJobModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchJobs}
      />
    </div>
  );
}
