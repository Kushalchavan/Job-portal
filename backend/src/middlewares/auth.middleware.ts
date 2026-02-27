import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded.id) {
      throw new AppError("Invalid token payload", 401);
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid Token", 401);
  }
};
