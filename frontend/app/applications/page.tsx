"use client";

import { useState } from "react";
import { ApplicationCard } from "@/components/application-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/components/protected-route";
import { useEffect } from "react";
import { getMyApplications } from "@/services/application.service";
import { Application, ApplicationStatus } from "@/types/application.types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const getApplicationsByStatus = (status: Application["status"]) => {
    return applications.filter((app) => app.status === status);
  };

  const statuses = Object.values(ApplicationStatus);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading applications...</p>;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              My Applications
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track the status of your job applications
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {applications.length > 0 ? (
              <Tabs defaultValue={ApplicationStatus.APPLIED} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value={ApplicationStatus.APPLIED}>
                    Applied (
                    {getApplicationsByStatus(ApplicationStatus.APPLIED).length})
                  </TabsTrigger>

                  <TabsTrigger value={ApplicationStatus.SHORTLISTED}>
                    Shortlisted (
                    {
                      getApplicationsByStatus(ApplicationStatus.SHORTLISTED)
                        .length
                    }
                    )
                  </TabsTrigger>

                  <TabsTrigger value={ApplicationStatus.REVIEWED}>
                    Interview (
                    {getApplicationsByStatus(ApplicationStatus.REVIEWED).length}
                    )
                  </TabsTrigger>

                  <TabsTrigger value={ApplicationStatus.REJECTED}>
                    Rejected (
                    {getApplicationsByStatus(ApplicationStatus.REJECTED).length}
                    )
                  </TabsTrigger>

                  <TabsTrigger value={ApplicationStatus.HIRED}>
                    Hired (
                    {getApplicationsByStatus(ApplicationStatus.HIRED).length})
                  </TabsTrigger>
                </TabsList>

                {statuses.map((status) => {
                  const statusApps = getApplicationsByStatus(status);
                  return (
                    <TabsContent
                      key={status}
                      value={status}
                      className="mt-6 space-y-4"
                    >
                      {statusApps.length > 0 ? (
                        statusApps.map((app) => (
                          <ApplicationCard key={app.id} application={app} />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 py-12">
                          <h3 className="text-lg font-semibold text-foreground">
                            No applications
                          </h3>
                          <p className="mt-2 text-muted-foreground">
                            You don&apos;t have any applications with this
                            status yet
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 py-16">
                <h3 className="text-lg font-semibold text-foreground">
                  No applications yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Start applying to jobs to track your applications here
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
