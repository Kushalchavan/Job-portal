import api from "@/lib/api";
import { CreateJobInput, Job, UpdateJobInput } from "@/types/job.types";

export const getJobs = async (): Promise<Job[]> => {
  const res = await api.get("/jobs");
  return res.data.jobs;
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get(`/jobs/${id}`);
  return res.data.job;
};

export const createJob = async (data: CreateJobInput): Promise<Job> => {
  const res = await api.post("/jobs", data);
  return res.data;
};

export const updateJob = async (id: number, data: UpdateJobInput): Promise<Job> => {
  const res = await api.put(`/jobs/${id}`, data);
  return res.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};
