import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  blockUser,
  getAdminDashboard,
  getAllUsers,
  unblockUser,
} from "./admin.service";

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  },
);

export const blockUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = await blockUser(userId);

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  },
);

export const unblockUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = await unblockUser(userId);

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  },
);

export const getAdminDashboardController = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getAdminDashboard();

    res.status(200).json({
      success: true,
      data: stats,
    });
  },
);
