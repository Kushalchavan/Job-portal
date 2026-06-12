import Link from "next/link";
import { Job } from "@/types/job.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p>Company: {job.company.name}</p>

        <p>Location: {job.location}</p>

        <p>
          Salary: ₹{job.minSalary.toLocaleString()} - ₹
          {job.maxSalary.toLocaleString()}
        </p>

        <p>
          {job.level} • {job.employmentType}
        </p>

        <p className="line-clamp-3">{job.description}</p>

        <Link href={`/jobs/${job.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
