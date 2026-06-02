import { prisma } from "../../config/prisma";
import { ApplicationStatus } from "@prisma/client";

export const getDashboardStats = async () => {
  const [totalJobs, totalResumes, totalMatches, bestMatch] = await Promise.all([
    prisma.job.count(),
    prisma.resume.count(),
    prisma.resumeMatch.count(),
    prisma.resumeMatch.findFirst({
      orderBy: {
        score: "desc",
      },
    }),
  ]);

  return {
    totalJobs,
    totalResumes,
    totalMatches,
    bestMatchScore: bestMatch?.score ?? 0,
  };
};

export const countRecruiterCompanies = async (userId: number) => {
  return prisma.company.count({
    where: {
      createdById: userId,
    },
  });
};

export const countRecruiterJobs = async (userId: number) => {
  return prisma.job.count({
    where: {
      createdById: userId,
    },
  });
};

export const countRecruiterApplicationByStatus = async (userId: number) => {
  const applications = await prisma.application.groupBy({
    by: ["status"],
    where: {
      job: {
        createdById: userId,
      },
    },
    _count: {
      status: true,
    },
  });

  return applications;
};
