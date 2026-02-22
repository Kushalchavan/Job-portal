import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const requireRole =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
