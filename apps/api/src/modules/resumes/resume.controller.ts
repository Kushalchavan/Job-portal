import { Request, Response } from "express";
import {
  createResume,
  deleteResume,
  getMyResumes,
  getResumeById,
} from "./resume.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { AppError } from "../../utils/AppError";

export const uploadResumeController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required and must be a PDF",
      });
    }

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const resume = await createResume({
      userId: req.user.id,
      originalName: req.file.originalname,
      storageKey: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    return res.status(201).json({
      success: true,
      file: req.file,
      data: resume,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};

export const getMyResumesController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const resumes = await getMyResumes(req.user.id);

    res.status(200).json({
      success: true,
      data: resumes,
    });
  },
);

export const getResumeByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError("Invalid resume id", 400);
    }
    const resume = await getResumeById(id);

    res.status(200).json({
      success: true,
      data: resume,
    });
  },
);

export const deleteResumeController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError("Invalid resume id", 400);
    }

    const resume = await deleteResume(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  },
);
