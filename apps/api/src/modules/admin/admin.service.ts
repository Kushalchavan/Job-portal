import { AppError } from "../../utils/AppError";
import {
  findUserByIdRepo,
  getAdminDashboardStatsRepo,
  getUsersRepo,
  updateUserStatusRepo,
} from "./admin.repository";

export const getAllUsers = async () => {
  return getUsersRepo();
};

export const blockUser = async (userId: number) => {
  const user = await findUserByIdRepo(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "ADMIN") {
    throw new AppError("Cannot block an admin", 400);
  }

  return updateUserStatusRepo(userId, false);
};

export const unblockUser = async (userId: number) => {
  const user = await findUserByIdRepo(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return updateUserStatusRepo(userId, true);
};

export const getAdminDashboard = async () => {
  return getAdminDashboardStatsRepo();
};
