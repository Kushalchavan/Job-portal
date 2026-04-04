import api from "@/lib/api";
import { Application, ApplicationStatus } from "@/types/application.types";

export const applyJob = async (jobId: number) => {
  const res = await api.post("/applications", {
    jobId,
  });

  return res.data.data;
};

export const getMyApplications = async (): Promise<Application[]> => {
  const res = await api.get("/applications/me");
  return res.data.data;
};

export const getApplicantsByJob = async (jobId: number): Promise<Application[]> => {
  const res = await api.get(`/applications/job/${jobId}`);
  return res.data.data;
};

export const updateApplicationStatus = async (
  id: number,
  status: ApplicationStatus,
): Promise<Application> => {
  const res = await api.patch(`/applications/${id}/status`, { status });
  return res.data.data;
};

export const withdrawApplication = async (id: number): Promise<void> => {
  await api.delete(`/applications/${id}`);
};
