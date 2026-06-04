import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import logger from "../config/logger";

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

  logger.error("Unhandled Error", {
    requestId: req.requestId,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // For unknown errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
