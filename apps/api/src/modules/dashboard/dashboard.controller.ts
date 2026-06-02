import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";

import {
  getDashboardData,
  getRecruiterDashboardData,
} from "./dashboard.service";

export const getDashboardStatsController =
  asyncHandler(async (_req: Request, res: Response) => {
    const stats = await getDashboardData();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

export const getRecruiterDashboardStatsController =
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const stats = await getRecruiterDashboardData(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  });