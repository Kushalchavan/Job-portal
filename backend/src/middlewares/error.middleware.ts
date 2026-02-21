import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  // For unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
