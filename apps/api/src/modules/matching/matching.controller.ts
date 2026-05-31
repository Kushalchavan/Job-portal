import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getJobMatches,
  getResumeMatches,
  getTopCandidates,
} from "./matching.service";

export const getMatchesByJobId = async (jobId: number) => {
  return prisma.resumeMatch.findMany({
    where: {
      jobId,
    },
    include: {
      resume: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      score: "desc",
    },
  });
};

export const getJobMatchesController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.jobId);

    const matches = await getJobMatches(jobId);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  },
);

export const getTopCandidatesController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.jobId);

    const candidates = await getTopCandidates(jobId);

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  },
);

export const getResumeMatchesController = asyncHandler(
  async (req: Request, res: Response) => {
    const resumeId = req.params.resumeId;

    const matches = await getResumeMatches(resumeId);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  },
);
