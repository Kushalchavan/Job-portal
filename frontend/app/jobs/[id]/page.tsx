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
import { applyJob } from "@/services/application.service";

export default function JobDetailsPage() {
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const jobId = Number(params.id);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    try {
      await applyJob(Number(jobId));
      setIsApplied(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading job...</p>;
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

  const formattedSalary = `$${(job.minSalary / 1000).toFixed(0)}K - $${(job.maxSalary / 1000).toFixed(0)}K`;

  return (
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
                {job.company.name}
              </p>
            </div>
            <div className="flex gap-3 sm:flex-col">
              <Button
                variant={isSaved ? "default" : "outline"}
                onClick={() => setIsSaved(!isSaved)}
                className={
                  isSaved ? "bg-accent text-accent-foreground" : "border-border"
                }
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                <span className="hidden sm:inline ml-2">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </Button>
              <Button
                onClick={() => setIsApplied(!isApplied)}
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
              <p className="font-semibold text-foreground">{formattedSalary}</p>
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
              <p className="font-semibold text-foreground">{job.level}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-accent mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">Location</span>
              </div>
              <p className="font-semibold text-foreground">{job.location}</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About the Role
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {job.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This is an exciting opportunity to grow your career with one of
                the industry leaders. You&apos;ll work on challenging projects,
                collaborate with talented professionals, and have the chance to
                make a real impact.
              </p>
            </Card>

            {/* Requirements */}
            {/* <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </Card> */}

            {/* Benefits */}
            {/* <Card className="p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What We Offer
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {job.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Apply Card */}
              <Card className="p-6 border-2 border-accent bg-accent/5">
                <h3 className="font-semibold text-foreground mb-4">
                  Ready to apply?
                </h3>
                <Button
                  onClick={handleApply}
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

              {/* Company Info */}
              <Card className="p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  About {job.company.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {job.company.name} is a leading company in the tech industry,
                  known for innovation and excellence.
                </p>
                <Link
                  href="#"
                  className="text-accent text-sm font-medium hover:text-accent/80 transition"
                >
                  View company profile →
                </Link>
              </Card>

              {/* Similar Jobs */}
              {/* <Card className="p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Similar roles
                </h3>
                <div className="space-y-3 text-sm">
                  {jobs
                    .filter((j) => j.id !== jobId && j.level === job.level)
                    .slice(0, 3)
                    .map((similarJob) => (
                      <Link
                        key={similarJob.id}
                        href={`/jobs/${similarJob.id}`}
                        className="block p-2 hover:bg-card rounded-lg transition group"
                      >
                        <p className="text-foreground group-hover:text-accent transition font-medium">
                          {similarJob.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {similarJob.company}
                        </p>
                      </Link>
                    ))}
                </div>
              </Card> */}

              {/* Stats */}
              {/* <Card className="p-6 border border-border">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications</span>
                    <span className="font-semibold text-foreground">
                      {job.applications}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span className="font-semibold text-foreground">
                      {Math.floor(
                        (new Date().getTime() - job.postedDate.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days ago
                    </span>
                  </div>
                </div>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
