import { Job } from "./job.types";

export interface JobsResponse {
  jobs: Job[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "USER" | "RECRUITER" | "ADMIN";
  };
}
