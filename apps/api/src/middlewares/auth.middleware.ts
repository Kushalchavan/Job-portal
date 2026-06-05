import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { findUserById } from "../modules/auth/auth.repository";
import { verifyAccessToken } from "../utils/jwt";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const decoded = verifyAccessToken(token);
    
    const user = await findUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account has been blocked", 403);
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch {
    throw new AppError("Invalid Token", 401);
  }
};
