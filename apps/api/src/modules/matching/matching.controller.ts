import { prisma } from "../../config/prisma";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getJobMatches } from "./matching.service";

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
      data: matches,
    });
  },
);
