import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import {
  applyToJob,
  getApplicantsByJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../service/application.service";

export const applyToJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const application = await applyToJob(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Applied to job successfully",
      data: application,
    });
  },
);

export const getMyApplicationsController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const applications = await getMyApplications(req.user.id);

    res.status(200).json({
      success: true,
      data: applications,
    });
  },
);

export const getApplicantsByJobController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const applicants = await getApplicantsByJob(Number(req.params.jobId));

    res.status(200).json({
      success: true,
      data: applicants,
    });
  },
);

export const updateApplicationStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const application = await updateApplicationStatus(
      Number(req.params.id),
      req.body.status,
    );

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  },
);

export const withdrawApplicationController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const application = await withdrawApplication(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: application,
    });
  },
);
