import { prisma } from "../../config/prisma";

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
