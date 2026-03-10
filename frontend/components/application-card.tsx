import { Application2 } from "@/lib/data";


interface ApplicationCardProps {
  application: Application2;
}

const statusColors: Record<Application2['status'], string> = {
  applied: 'badge-pending',
  shortlisted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  interviewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  rejected: 'badge-rejected',
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  const statusColor = statusColors[application.status];

  return (
    <div className="job-card">
      <div className="flex flex-col justify-between sm:flex-row sm:items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{application.jobTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{application.company}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Applied on {new Date(application.appliedDate).toLocaleDateString()}
          </p>
        </div>
        <div className={`badge ${statusColor} mt-4 sm:mt-0`}>
          {application.status}
        </div>
      </div>
    </div>
  );
}
