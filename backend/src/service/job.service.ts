import { prisma } from "../config/prisma";
import { CreateJobInput, UpdateJobInput } from "../types/job.types";
import { AppError } from "../utils/AppError";

export const createJobs = async (data: CreateJobInput, userId: number) => {
  // check if company already exists
  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) {
    throw new AppError("Company Not Found", 404);
  }

  // ensure recruiter owns this company
  if (company.createdById !== userId) {
    throw new AppError(
      "You are not allowed to post jobs for this company",
      403,
    );
  }

  // Create job
  const job = await prisma.job.create({
    data: {
      ...data,
      createdById: userId,
    },
  });

  return job;
};

export const updateJobs = async (data: UpdateJobInput, userId: number) => {
  // check if job exists or not
  const job = await prisma.job.findUnique({
    where: { id: data.id },
  });

  if (!job) {
    throw new AppError("Job does not exits", 404);
  }

  // checking ownership
  if (job.createdById !== userId) {
    throw new AppError("You are not allowed to update this job", 403);
  }
  const { id, ...rest } = data;
  // remove undefined values from data
  const updatedData = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== undefined),
  );

  // update job
  const updatedJob = await prisma.job.update({
    where: { id: data.id },
    data: updatedData,
  });
  return updatedJob;
};

export const getJobs = async () => {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
  });

  return jobs;
};

export const getJobById = async (jobId: number) => {
  // check if job exists
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
      isActive: true,
      deletedAt: null,
    },
  });

  if (!job) {
    throw new AppError("The Job you are looking for does not exists", 404);
  }

  return job;
};

export const deleteJobs = async (jobId: number, userId: number) => {
  // check if job exists or not
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // checking ownership
  if (job.createdById !== userId) {
    throw new AppError("You are not allowed to delete this job", 403);
  }

  const deletedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return deletedJob;
};
