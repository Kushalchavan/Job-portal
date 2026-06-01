import { prisma } from "../../config/prisma";

export const findCompanyById = async (companyId: number) => {
  return prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
};

export const createJobRepo = async (
  data: any,
  userId: number,
) => {
  return prisma.job.create({
    data: {
      ...data,
      createdById: userId,
    },
  });
};

export const findJobById = async (jobId: number) => {
  return prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });
};

export const updateJobRepo = async (
  jobId: number,
  data: Record<string, unknown>,
) => {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data,
  });
};

export const getJobsRepo = async () => {
  return prisma.job.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    include: {
      company: true,
    },
  });
};

export const getJobDetailsRepo = async (jobId: number) => {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      isActive: true,
      deletedAt: null,
    },
  });
};

export const softDeleteJobRepo = async (jobId: number) => {
  return prisma.job.update({
    where: {
      id: jobId,
    },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });
};