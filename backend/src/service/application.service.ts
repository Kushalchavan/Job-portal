import { ApplicationStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

interface ApplyJobInput {
  jobId: number;
  resumeUrl?: string;
}

export const applyToJob = async (userId: number, data: ApplyJobInput) => {
  const { jobId, resumeUrl } = data;

  // Check if job exists
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Prevent duplicate application
  const existingApplication = await prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });

  if (existingApplication) {
    throw new AppError("You have already applied to this job", 400);
  }

  // Create application
  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      resumeUrl: resumeUrl ?? null,
    },
  });

  return application;
};

// FIXED HERE
export const getMyApplications = async (userId: number) => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getApplicantsByJob = async (jobId: number) => {
  return prisma.application.findMany({
    where: { jobId },
    include: {
      user: true,
    },
  });
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: ApplicationStatus,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });
};

export const withdrawApplication = async (
  applicationId: number,
  userId: number,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (application.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return prisma.application.delete({
    where: { id: applicationId },
  });
};