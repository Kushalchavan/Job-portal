import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import {
  getMySavedJobs,
  saveJob,
  unsaveJob,
} from "./saved-job.service";

export const saveJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const savedJob = await saveJob(
      req.user.id,
      Number(req.params.jobId),
    );

    res.status(201).json({
      success: true,
      message: "Job saved successfully",
      data: savedJob,
    });
  },
);

export const getSavedJobsController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const savedJobs = await getMySavedJobs(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: savedJobs,
    });
  },
);

export const unsaveJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    await unsaveJob(
      req.user.id,
      Number(req.params.jobId),
    );

    res.status(200).json({
      success: true,
      message: "Job removed from saved jobs",
    });
  },
);