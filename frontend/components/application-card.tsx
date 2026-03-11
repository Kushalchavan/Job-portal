import { Application } from "@/types/application.types";

interface ApplicationCardProps {
  application: Application;
}

const statusColors: Record<Application["status"], string> = {
  APPLIED: "badge-pending",
  REVIEWED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  SHORTLISTED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  REJECTED: "badge-rejected",
  HIRED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusColor = statusColors[application.status];

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

        <div className={`badge ${statusColor} mt-4 sm:mt-0`}>
          {application.status}
        </div>
      </div>
    </div>
  );
}