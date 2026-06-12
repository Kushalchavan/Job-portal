import { api } from "@/lib/axios";

export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

export const getJobById = async (id: number) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};