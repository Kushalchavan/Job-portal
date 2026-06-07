import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  changeMatchStatus,
  getCandidatePipeline,
  getCandidateProfileData,
  getCandidatesByPipeline,
  getJobMatches,
  getResumeMatches,
  getTopCandidates,
} from "./matching.service";
import { CandidateStatus } from "@prisma/client";
import { updateMatchStatusSchema } from "./matching.validation";

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
    const { resumeId } = req.params as {
      resumeId: string;
    };

    const matches = await getResumeMatches(resumeId);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  },
);

export const updateMatchStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const { matchId } = req.params as {
      matchId: string;
    };

    const { status } = updateMatchStatusSchema.parse(req.body);

    const updatedMatch = await changeMatchStatus(matchId, status);

    res.status(200).json({
      success: true,
      data: updatedMatch,
    });
  },
);

export const getCandidatesByStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.jobId);

    const status = req.query.status as CandidateStatus;

    const candidates = await getCandidatesByPipeline(jobId, status);

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  },
);

export const getCandidatePipelineController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.jobId);

    const pipeline = await getCandidatePipeline(jobId);

    res.status(200).json({
      success: true,
      data: pipeline,
    });
  },
);

export const getCandidateProfileController = asyncHandler(
  async (req: Request, res: Response) => {
    const { resumeId } = req.params as {
      resumeId: string;
    };

    const candidate = await getCandidateProfileData(resumeId);

    res.status(200).json({
      success: true,
      data: candidate,
    });
  },
);
