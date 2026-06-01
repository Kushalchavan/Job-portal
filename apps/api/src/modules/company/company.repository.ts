import { prisma } from "../../config/prisma";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.types";

export const createCompanyRepository = async (
  data: CreateCompanyInput,
  userId: number,
) => {
  return prisma.company.create({
    data: {
      ...data,
      website: data.website ?? null,
      createdById: userId,
    },
  });
};

export const findCompanyById = async (id: number) => {
  return prisma.company.findUnique({
    where: {
      id,
    },
  });
};

export const updateCompanyRepository = async (
  id: number,
  data: Partial<UpdateCompanyInput>,
) => {
  return prisma.company.update({
    where: {
      id,
    },
    data,
  });
};

export const getAllCompaniesByUserId = async (userId: number) => {
  return prisma.company.findMany({
    where: {
      createdById: userId,
    },
  });
};

export const getCompanyByIdAndUserId = async (id: number, userId: number) => {
  return prisma.company.findFirst({
    where: {
      id,
      createdById: userId,
    },
  });
};

export const countCompanyJobs = async (companyId: number) => {
  return prisma.job.count({
    where: {
      companyId,
    },
  });
};

export const deleteCompanyRepository = async (id: number) => {
  return prisma.company.delete({
    where: {
      id,
    },
  });
};
