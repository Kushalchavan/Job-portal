import api from "@/lib/api";
import { Application } from "@/types/application.types";

export const applyJob = async (jobId: number) => {
  const res = await api.post("/applications", {
    jobId,
  });

  return res.data;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const res = await api.get("/applications/me");
  return res.data.applications;
};
