import { Job } from "./job.types";

export enum ApplicationStatus {
  APPLIED = "APPLIED",
  REVIEWED = "REVIEWED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  HIRED = "HIRED",
}

export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  resumeUrl?: string;
  job: Job;
  createdAt: string;
}
