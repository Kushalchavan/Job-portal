import { AppError } from "../../utils/AppError";
import { findJobById } from "../job/job.repository";
import {
  createSavedJob,
  deleteSavedJob,
  findSavedJob,
  getSavedJobs,
} from "./saved-job.repository";

export const saveJob = async (
  userId: number,
  jobId: number,
) => {
  const job = await findJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existingSavedJob = await findSavedJob(
    userId,
    jobId,
  );

  if (existingSavedJob) {
    throw new AppError(
      "Job already saved",
      400,
    );
  }

  return createSavedJob(userId, jobId);
};

export const getMySavedJobs = async (
  userId: number,
) => {
  return getSavedJobs(userId);
};

export const unsaveJob = async (
  userId: number,
  jobId: number,
) => {
  const existingSavedJob = await findSavedJob(
    userId,
    jobId,
  );

  if (!existingSavedJob) {
    throw new AppError(
      "Saved job not found",
      404,
    );
  }

  return deleteSavedJob(userId, jobId);
};