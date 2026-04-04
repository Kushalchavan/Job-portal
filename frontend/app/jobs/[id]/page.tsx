"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getJobById } from "@/services/job.service";
import { Job } from "@/types/job.types";
import {
  applyJob,
  getMyApplications,
} from "@/services/application.service";
import ProtectedRoute from "@/components/protected-route";

export default function JobDetailsPage() {
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  // Safe parsing
  const jobId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (isNaN(jobId)) {
      console.error("Invalid jobId:", params.id);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [jobData, applications] = await Promise.all([
          getJobById(jobId),
          getMyApplications(),
        ]);

        setJob(jobData);

        // Check if already applied
        const alreadyApplied = applications.some(
          (app) => app.jobId === jobId
        );

        setIsApplied(alreadyApplied);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, params.id]);

  const handleApply = async () => {
    if (isNaN(jobId)) return;

    try {
      const res = await applyJob(jobId);
      console.log("Application success:", res);

      setIsApplied(true); //update UI instantly
    } catch (error: any) {
      console.error("Apply error:", error);

      const message = error?.response?.data?.message;

      if (message) {
        alert(message); // later replace with toast
      }
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading job...</p>;
  }

  if (isNaN(jobId)) {
    return <p className="text-center py-10 text-red-500">Invalid Job ID</p>;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
          <Link href="/jobs">
            <Button className="bg-accent text-accent-foreground">
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedSalary =
    job.minSalary && job.maxSalary
      ? `$${(job.minSalary / 1000).toFixed(0)}K - $${(
          job.maxSalary / 1000
        ).toFixed(0)}K`
      : "Salary not disclosed";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Back Button */}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          {/* Header Card */}
          <Card className="p-6 sm:p-8 mb-8 border border-border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {job.company?.name ?? "Unknown Company"}
                </p>
              </div>

              <div className="flex gap-3 sm:flex-col">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={() => setIsSaved(!isSaved)}
                  className={
                    isSaved
                      ? "bg-accent text-accent-foreground"
                      : "border-border"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  <span className="hidden sm:inline ml-2">
                    {isSaved ? "Saved" : "Save"}
                  </span>
                </Button>

                <Button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={
                    isApplied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }
                >
                  {isApplied ? "✓ Applied" : "Apply Now"}
                </Button>
              </div>
            </div>

            {/* Job Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-border py-6">
              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Salary</span>
                </div>
                <p className="font-semibold text-foreground">
                  {formattedSalary}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Type</span>
                </div>
                <p className="font-semibold text-foreground">
                  {job.employmentType}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">Level</span>
                </div>
                <p className="font-semibold text-foreground">
                  {job.level}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-accent mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    Location
                  </span>
                </div>
                <p className="font-semibold text-foreground">
                  {job.location}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  About the Role
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {job.description}
                </p>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card className="p-6 border-2 border-accent bg-accent/5">
                  <h3 className="font-semibold text-foreground mb-4">
                    Ready to apply?
                  </h3>

                  <Button
                    onClick={handleApply}
                    disabled={isApplied}
                    className={
                      isApplied
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }
                  >
                    {isApplied ? "✓ Applied" : "Apply Now"}
                  </Button>

                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Free to apply • Takes less than 2 minutes
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}