import { Job } from "./job.types";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  resumeUrl?: string;
  job: Job;
  createdAt: string;
}
