import { prisma } from "../config/prisma";
import { CreateCompanyInput, UpdateCompanyInput } from "../types/company.types";
import { AppError } from "../utils/AppError";

export const createCompany = async (
  data: CreateCompanyInput,
  userId: number,
) => {
  const company = await prisma.company.create({
    data: {
      ...data,
      website: data.website ?? null,
      createdById: userId,
    },
  });
  return company;
};

export const updateCompany = async (
  data: UpdateCompanyInput,
  userId: number,
) => {
  const company = await prisma.company.findUnique({
    where: { id: data.id },
  });

  // Check if the company exists
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // check if the user/recruiter is the owner of the company
  if (company.createdById !== userId) {
    throw new AppError("Not Allowed", 403);
  }

  const { id, website, ...rest } = data;

  //  Remove undefined fields
  const cleanData = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== undefined),
  );

  return prisma.company.update({
    where: { id },
    data: {
      ...cleanData,
      ...(website !== undefined && { website: website ?? null }),
    },
  });
};

export const getAllCompanies = async (userId: number) => {
  return prisma.company.findMany({
    where: {
      createdById: userId,
    },
  });
};

export const deleteCompany = async (id: number, userId: number) => {
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // check if the user/recruiter is the owner of the company
  if (company.createdById !== userId) {
    throw new AppError("Not allowed", 403);
  }

  // Check if there are any jobs associated with the company   
  const jobCount = await prisma.job.count({
    where: { companyId: id },
  });

  // If there are jobs, prevent deletion and throw an error
  if (jobCount > 0) {
    throw new AppError("Cannot delete company with existing jobs", 400);
  }

  return prisma.company.delete({
    where: { id },
  });
};
