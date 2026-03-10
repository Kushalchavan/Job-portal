"use client";

import Link from "next/link";
import { Job } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, Users } from "lucide-react";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formattedSalary = `$${(job.salary.min / 1000).toFixed(0)}K - $${(job.salary.max / 1000).toFixed(0)}K`;

  return (
    <Card className="p-6 hover:shadow-lg hover:ring-accent/50 transition-all duration-200 cursor-pointer">
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground hover:text-accent transition">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-sm">{job.company}</p>
            </div>
            <Badge variant="outline" className="shrink-0">
              {job.level}
            </Badge>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4 text-accent" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>{formattedSalary}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4 text-accent" />
              <span>{job.applications} applications</span>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>

          {/* Posted Date */}
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            Posted{" "}
            {Math.floor(
              (new Date().getTime() - job.postedDate.getTime()) /
                (1000 * 60 * 60 * 24),
            )}{" "}
            days ago
          </div>
        </div>
      </Link>
    </Card>
  );
}
