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
import { EmploymentType, Level } from "@prisma/client";
import { clearJobsCache, getCache, setCache } from "../../utils/cache";
import logger from "../../config/logger";
import { jobCreatedCounter } from "../../metrics/app.metrics";

export const createJobs = async (
  data: any,
  userId: number,
  requestId: string,
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

  // Increment the job creation counter for Prometheus metrics
  jobCreatedCounter.inc();

  await clearJobsCache();

  eventEmitter.emit(EVENTS.JOB_CREATED_EVENT, {
    requestId,
    jobId: job.id,
  });

  return job;
};

export const updateJob = async (data: any, userId: number) => {
  const job = await findJobById(data.id);

  if (!job) {
    throw new AppError("Job does not exist", 404);
  }

  if (job.createdById !== userId) {
    throw new AppError("You are not allowed to update this job", 403);
  }

  const { id, ...rest } = data;

  const updatedData = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== undefined),
  );

  const updatedJob = updateJobRepo(id, updatedData);
  await clearJobsCache();

  return updatedJob;
};

export const getJobs = async (
  page: number,
  limit: number,
  search?: string,
  location?: string,
  level?: Level,
  employmentType?: EmploymentType,
  minSalary?: number,
  maxSalary?: number,
  sort?: string,
) => {
  const cacheKey = `jobs:${page}:${limit}:${search ?? ""}:${location ?? ""}:${level ?? ""}:${employmentType ?? ""}:${minSalary ?? ""}:${maxSalary ?? ""}:${sort ?? ""}`;

  const cachedData = await getCache<{
    jobs: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(cacheKey);

  if (cachedData) {
    logger.info("Jobs cache hit", {
      cachedDataCount: cachedData.jobs.length,
    });
    return cachedData;
  }

  logger.info("Jobs cache miss");

  const { jobs, total } = await getJobsRepo(
    page,
    limit,
    search,
    location,
    level,
    employmentType,
    minSalary,
    maxSalary,
    sort,
  );

  const result = {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  await setCache(cacheKey, result, 60);

  return result;
};

export const getJobById = async (jobId: number) => {
  const job = await getJobDetailsRepo(jobId);

  if (!job) {
    throw new AppError("The Job you are looking for does not exist", 404);
  }

  return job;
};

export const deleteJobs = async (jobId: number, userId: number) => {
  const job = await findJobById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  if (job.createdById !== userId) {
    throw new AppError("You are not allowed to delete this job", 403);
  }

  const deletedJob = await softDeleteJobRepo(jobId);
  await clearJobsCache();

  return deletedJob;
};
