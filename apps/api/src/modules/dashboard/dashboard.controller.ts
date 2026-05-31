import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getDashboardData } from "./dashboard.service";

export const getDashboardStatsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getDashboardData();

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);