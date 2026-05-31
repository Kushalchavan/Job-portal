import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { getAnalytics } from "./analytics.service";

export const getAnalyticsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const analytics = await getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  },
);
