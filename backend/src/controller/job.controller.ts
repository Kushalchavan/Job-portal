import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createJobs,
  deleteJobs,
  getJobById,
  getJobs,
  updateJob,
} from "../service/job.service";
import { AppError } from "../utils/AppError";

export const createJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const job = await createJobs(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: job,
    });
  },
);

export const updateJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const updatedJob = await updateJob(
      { ...req.body, id: Number(req.params.id) },
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: updatedJob,
    });
  },
);

export const getJobsController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobs = await getJobs();

    res.status(200).json({
      success: true,
      data: jobs,
    });
  },
);

export const getJobByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = Number(req.params.id);
    const job = await getJobById(jobId);

    res.status(200).json({
      success: true,
      data: job,
    });
  },
);

export const deleteJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const jobId = Number(req.params.id);
    const deleteJob = await deleteJobs(jobId, req.user.id);

    res.status(201).json({
      success: true,
      messsage: "Job Deleted Successfully",
      data: deleteJob,
    });
  },
);
