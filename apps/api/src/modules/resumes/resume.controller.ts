import { Request, Response } from "express";
import { createResume } from "./resume.service";

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required and must be a PDF",
      });
    }

    const resume = await createResume({
      userId: 1,/// temp
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
      sucess: false,
      message: "Failed to upload resume",
    });
  }
};
