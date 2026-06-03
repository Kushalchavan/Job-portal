import { prisma } from "../../config/prisma";
import { CandidateStatus } from "@prisma/client";

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
    take: 5
  });
};

export const getTopCandidatesByJobId = async (jobId: number) => {
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

export const getMatchesByResumeId = async (resumeId: string) => {
  return prisma.resumeMatch.findMany({
    where: {
      resumeId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          employmentType: true,
        },
      },
    },
    orderBy: {
      score: "desc",
    },
  });
};

export const updateMatchStatus = async (
  matchId: string,
  status: CandidateStatus,
) => {
  return prisma.resumeMatch.update({
    where: {
      id: matchId,
    },
    data: {
      status,
    },
  });
};

export const getCandidatesByStatus = async (
  jobId: number,
  status: CandidateStatus,
) => {
  return prisma.resumeMatch.findMany({
    where: {
      jobId,
      status,
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

export const getMatchById = async (matchId: string) => {
  return prisma.resumeMatch.findUnique({
    where: {
      id: matchId,
    },
    include: {
      resume: true,
      job: true,
    },
  });
};

export const getPipelineByJobId = async (jobId: number) => {
  return prisma.resumeMatch.groupBy({
    by: ["status"],
    where: {
      jobId,
    },
    _count: {
      status: true,
    },
  });
};

export const getCandidateProfile = async (
  resumeId: string,
) => {
  return prisma.resume.findUnique({
    where: {
      id: resumeId,
    },
    include: {
      resumeMatches: {
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              employmentType: true,
            },
          },
        },
      },
    },
  });
};