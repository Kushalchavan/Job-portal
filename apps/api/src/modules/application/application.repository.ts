import { prisma } from "../../config/prisma";
import { ApplicationStatus } from "@prisma/client";

export const findJobById = async (jobId: number) => {
  return prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
};

export const findExistingApplication = async (
  userId: number,
  jobId: number,
) => {
  return prisma.application.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
};

export const createApplicationRepo = async (
  userId: number,
  jobId: number,
  resumeUrl?: string,
) => {
  return prisma.application.create({
    data: {
      userId,
      jobId,
      resumeUrl: resumeUrl ?? null,
    },
  });
};

export const getUserApplicationsRepo = async (
  userId: number,
) => {
  return prisma.application.findMany({
    where: {
      userId,
    },
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

export const getJobApplicantsRepo = async (
  jobId: number,
) => {
  return prisma.application.findMany({
    where: {
      jobId,
    },
    include: {
      user: true,
    },
  });
};

export const findApplicationById = async (
  applicationId: number,
) => {
  return prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      user: true,
      job: true,
    },
  });
};

export const updateApplicationStatusRepo = async (
  applicationId: number,
  status: ApplicationStatus,
) => {
  return prisma.application.update({
    where: {
      id: applicationId,
    },
    data: {
      status,
    },
  });
};

export const deleteApplicationRepo = async (
  applicationId: number,
) => {
  return prisma.application.delete({
    where: {
      id: applicationId,
    },
  });
};
