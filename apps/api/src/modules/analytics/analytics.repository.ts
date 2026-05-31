import { prisma } from "../../config/prisma";

export const getAnalyticsData = async () => {
  const jobs = await prisma.job.findMany({
    select: {
      requiredSkills: true,
    },
  });

  const resumes = await prisma.resume.findMany({
    select: {
      skills: true,
    },
  });

  const matches = await prisma.resumeMatch.findMany({
    select: {
      score: true,
    },
  });

  return {
    jobs,
    resumes,
    matches,
  };
};
