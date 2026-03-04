import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
} from "../service/company.service";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

export const createCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
      if (!req.user) {
        throw new AppError("Unauthorized", 401);
      }
    const company = await createCompany(req.body, req.user.id);

    res.status(201).json({
      success: true,
      data: company,
    });
  },
);

export const updateCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const updatedCompany = await updateCompany(
      { ...req.body, id: Number(req.params.id) },
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: updatedCompany,
    });
  },
);

export const getAllCompaniesController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const companies = await getAllCompanies(req.user.id);

    res.status(200).json({
      success: true,
      data: companies,
    });
  },
);

export const deleteCompanyController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const deletedCompany = await deleteCompany(
      Number(req.params.id),
      req.user.id,
    );

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: deletedCompany,
    });
  },
);
