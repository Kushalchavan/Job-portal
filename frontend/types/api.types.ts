import { Job } from "./job.types";

export interface JobsResponse {
  jobs: Job[];
}

 export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string; // JWT token
  };
}

