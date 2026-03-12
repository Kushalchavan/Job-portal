"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Application, ApplicationStatus } from "@/types/application.types";
import {
  getApplicantsByJob,
  updateApplicationStatus,
} from "@/services/application.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JobApplicantsPage() {
  const params = useParams();
  const jobId = Number(params.id);

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const data = await getApplicantsByJob(jobId);
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusUpdate = async (
    applicationId: number,
    status: ApplicationStatus,
  ) => {
    try {
      await updateApplicationStatus(applicationId, status);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app,
        ),
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        {" "}
        <p className="text-muted-foreground">Loading applicants...</p>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {" "}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Job Applicants</h1>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Candidate #{app.userId}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </p>

                    <p className="text-sm mt-1">
                      Status: <strong>{app.status}</strong>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(
                          app.id,
                          ApplicationStatus.SHORTLISTED,
                        )
                      }
                    >
                      Shortlist
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(app.id, ApplicationStatus.REJECTED)
                      }
                    >
                      Reject
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusUpdate(app.id, ApplicationStatus.HIRED)
                      }
                    >
                      Hire
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border border-border">
            <p className="text-muted-foreground">No applicants yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
