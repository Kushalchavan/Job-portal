import {
  createCompanyRepository,
  deleteCompanyRepository,
  findCompanyById,
  getAllCompaniesByUserId,
  getCompanyByIdAndUserId,
  updateCompanyRepository,
  countCompanyJobs,
} from "./company.repository";

import {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../../types/company.types";

import { AppError } from "../../utils/AppError";

export const createCompany = async (
  data: CreateCompanyInput,
  userId: number,
) => {
  return createCompanyRepository(data, userId);
};

export const updateCompany = async (
  data: UpdateCompanyInput,
  userId: number,
) => {
  const company = await findCompanyById(data.id);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  if (company.createdById !== userId) {
    throw new AppError("Not Allowed", 403);
  }

  const { id, website, ...rest } = data;

  const cleanData = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== undefined),
  );

  return updateCompanyRepository(id, {
    ...cleanData,
    ...(website !== undefined && {
      website: website ?? null,
    }),
  });
};

export const getAllCompanies = async (userId: number) => {
  return getAllCompaniesByUserId(userId);
};

export const getCompanyById = async (id: number, userId: number) => {
  const company = await getCompanyByIdAndUserId(id, userId);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return company;
};

export const deleteCompany = async (id: number, userId: number) => {
  const company = await findCompanyById(id);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  if (company.createdById !== userId) {
    throw new AppError("Not allowed", 403);
  }

  const jobCount = await countCompanyJobs(id);

  if (jobCount > 0) {
    throw new AppError("Cannot delete company with existing jobs", 400);
  }

  return deleteCompanyRepository(id);
};
