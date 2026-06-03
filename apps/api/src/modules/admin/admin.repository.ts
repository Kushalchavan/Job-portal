import { Role } from "@prisma/client/index-browser";
import { prisma } from "../../config/prisma";

export const getUsersRepo = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserStatusRepo = async (
  userId: number,
  isActive: boolean,
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
  });
};

export const findUserByIdRepo = async (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const getAdminDashboardStatsRepo = async () => {
  const [
    totalUsers,
    totalRecruiters,
    blockedUsers,
    totalCompanies,
    totalJobs,
    activeJobs,
    totalApplications,
    totalResumes,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: Role.USER,
      },
    }),

    prisma.user.count({
      where: {
        role: Role.RECRUITER,
      },
    }),

    prisma.user.count({
      where: {
        isActive: false,
      },
    }),

    prisma.company.count(),

    prisma.job.count(),

    prisma.job.count({
      where: {
        isActive: true,
        deletedAt: null,
      },
    }),

    prisma.application.count(),

    prisma.resume.count(),
  ]);

  return {
    totalUsers,
    totalRecruiters,
    blockedUsers,
    totalCompanies,
    totalJobs,
    activeJobs,
    totalApplications,
    totalResumes,
  };
};
