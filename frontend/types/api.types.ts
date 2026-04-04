import { Job } from "./job.types";

export interface JobsResponse {
  jobs: Job[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
