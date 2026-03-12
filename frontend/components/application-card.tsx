import { Application } from "@/types/application.types";
import { withdrawApplication } from "@/services/application.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ApplicationCardProps {
  application: Application;
}

const statusColors: Record<Application["status"], string> = {
  APPLIED: "badge-pending",
  REVIEWED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  SHORTLISTED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  REJECTED: "badge-rejected",
  HIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusColor = statusColors[application.status];

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(application.id);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="job-card">
      <div className="flex flex-col justify-between sm:flex-row sm:items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            {application.job.title}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {application.job.company.name}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3 mt-4 sm:mt-0">
          <div className={`badge ${statusColor}`}>
            {application.status}
          </div>

          <div className="flex gap-2">
            <Link href={`/jobs/${application.jobId}`}>
              <Button size="sm" variant="outline">
                View Job
              </Button>
            </Link>

            {application.status === "APPLIED" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleWithdraw}
              >
                Withdraw
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}