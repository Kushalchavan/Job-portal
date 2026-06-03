import { prisma } from "../../config/prisma";

export const findSavedJob = async (
  userId: number,
  jobId: number,
) => {
  return prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
};

export const createSavedJob = async (
  userId: number,
  jobId: number,
) => {
  return prisma.savedJob.create({
    data: {
      userId,
      jobId,
    },
  });
};

export const getSavedJobs = async (
  userId: number,
) => {
  return prisma.savedJob.findMany({
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

export const deleteSavedJob = async (
  userId: number,
  jobId: number,
) => {
  return prisma.savedJob.delete({
    where: {
      userId_jobId: {
        userId,
        jobId,
      },
    },
  });
};