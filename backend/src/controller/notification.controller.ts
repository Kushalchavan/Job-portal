import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: notifications,
    });
  },
);

export const readNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id || Array.isArray(id)) {
      throw new AppError("Invalid notification id", 400);
    }

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });

    if (result.count === 0) {
      throw new AppError("Notification not found", 404);
    }

    res.json({
      success: true,
    });
  },
);
