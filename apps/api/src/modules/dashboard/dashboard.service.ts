import {
  getDashboardStats,
  countRecruiterCompanies,
  countRecruiterJobs,
  countRecruiterApplicationByStatus,
} from "./dashboard.repository";

export const getDashboardData = async () => {
  return getDashboardStats();
};

export const getRecruiterDashboardData = async (
  userId: number,
) => {
  const [
    totalCompanies,
    totalJobs,
    applicationsByStatus,
  ] = await Promise.all([
    countRecruiterCompanies(userId),
    countRecruiterJobs(userId),
    countRecruiterApplicationByStatus(userId),
  ]);

  return {
    totalCompanies,
    totalJobs,
    applicationsByStatus,
  };
};