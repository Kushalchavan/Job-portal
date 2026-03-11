import api from "@/lib/api";
import { Job } from "@/types/job.types";

export const getJobs = async (): Promise<Job[]> => {
  const res = await api.get("/jobs");
  return res.data.jobs;
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get(`/jobs/${id}`);
  return res.data.job;
};