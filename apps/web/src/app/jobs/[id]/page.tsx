"use client";

import { useEffect, useState } from "react";
import { getJobById } from "@/services/job.service";
import { Job } from "@/types/job.types";

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { id } = await params;

        const response = await getJobById(Number(id));

        setJob(response.data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto p-6">Job not found</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-4xl font-bold">{job.title}</h1>

      <div className="space-y-4">
        <p>
          <strong>Company:</strong> {job.company?.name}
        </p>

        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Salary:</strong> ₹{job.minSalary.toLocaleString()} - ₹
          {job.maxSalary.toLocaleString()}
        </p>

        <p>
          <strong>Experience:</strong> {job.minExperience} - {job.maxExperience}{" "}
          years
        </p>

        <p>
          <strong>Level:</strong> {job.level}
        </p>

        <p>
          <strong>Employment Type:</strong> {job.employmentType}
        </p>

        <div>
          <strong>Description:</strong>

          <p className="mt-2">{job.description}</p>
        </div>

        {job.requiredSkills.length > 0 && (
          <div>
            <strong>Skills:</strong>

            <div className="mt-2 flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
