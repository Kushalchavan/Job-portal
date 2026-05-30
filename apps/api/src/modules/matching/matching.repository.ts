import { prisma } from "../../config/prisma";

export const getActiveJobs = async () => {
  return prisma.job.findMany({
    where: {
      isActive: true,
    },
  });
};

export const createResumeMatch = async (data: {
  resumeId: string;
  jobId: number;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}) => {
  return prisma.resumeMatch.create({
    data,
  });
};

export const getMatchesByJobId = async (jobId: number) => {
  return prisma.resumeMatch.findMany({
    where: {
      jobId,
    },
    include: {
      resume: {
        select: {
          id: true,
          originalName: true,
          skills: true,
        },
      },
    },
    orderBy: {
      score: "desc",
    },
  });
};
