import { AppError } from "../../utils/AppError";
import { EVENTS } from "../../events/events.contants";
import { eventEmitter } from "../../events/eventEmitter";
import {
  createJobRepo,
  findCompanyById,
  findJobById,
  getJobDetailsRepo,
  getJobsRepo,
  softDeleteJobRepo,
  updateJobRepo,
} from "./job.repository";

export const createJobs = async (
  data: any,
  userId: number,
) => {
  const company = await findCompanyById(data.companyId);

  if (!company) {
    throw new AppError("Company Not Found", 404);
  }

  if (company.createdById !== userId) {
    throw new AppError(
      "You are not allowed to post jobs for this company",
      403,
    );
  }

  const job = await createJobRepo(data, userId);

  eventEmitter.emit(EVENTS.JOB_CREATED_EVENT, {
    jobId: job.id,
  });

  return job;
};

export const updateJob = async (
  data: any,
  userId: number,
) => {
  const job = await findJobById(data.id);

  if (!job) {
    throw new AppError("Job does not exist", 404);
  }

  if (job.createdById !== userId) {
    throw new AppError(
      "You are not allowed to update this job",
      403,
    );
  }

  const { id, ...rest } = data;

  const updatedData = Object.fromEntries(
    Object.entries(rest).filter(
      ([_, value]) => value !== undefined,
    ),
  );

  return updateJobRepo(id, updatedData);
};

export const getJobs = async () => {
  return getJobsRepo();
};

export const getJobById = async (jobId: number) => {
  const job = await getJobDetailsRepo(jobId);

  if (!job) {
    throw new AppError(
      "The Job you are looking for does not exist",
      404,
    );
  }

  return job;
};

export const deleteJobs = async (
  jobId: number,
  userId: number,
) => {
  const job = await findJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.createdById !== userId) {
    throw new AppError(
      "You are not allowed to delete this job",
      403,
    );
  }

  return softDeleteJobRepo(jobId);
};