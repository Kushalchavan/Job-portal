import { api } from "@/lib/axios";
import { CreateJobPayload } from "@/types/create-job.types";

export const createJob = async (
  data: CreateJobPayload,
  accessToken: string,
) => {
  const response = await api.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const deleteJob = async (id: number, accessToken: string) => {
  const response = await api.delete(`/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const getJobs = async () => {
  const response = await api.get("/jobs");

  return response.data;
};

export const getJobById = async (id: number) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data;
};
