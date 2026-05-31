import { getDashboardStats } from "./dashboard.repository";

export const getDashboardData = async () => {
  return getDashboardStats();
};