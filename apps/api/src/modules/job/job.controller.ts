import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";
import {
  createJobs,
  deleteJobs,
  getJobById,
  getJobs,
  updateJob,
} from "./job.service";
import { EmploymentType, Level } from "@prisma/client";

export const createJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const job = await createJobs(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
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
      {
        ...req.body,
        id: Number(req.params.id),
      },
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  },
);

export const getJobsController = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search as string;

    const location = req.query.location as string;

    const level = req.query.level as Level;

    const employmentType = req.query.employmentType as EmploymentType;

    const result = await getJobs(
      page,
      limit,
      search,
      location,
      level,
      employmentType,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  },
);

export const getJobByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const job = await getJobById(Number(req.params.id));

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

    const deletedJob = await deleteJobs(Number(req.params.id), req.user.id);

    res.status(200).json({
      success: true,
      message: "Job Deleted Successfully",
      data: deletedJob,
    });
  },
);
