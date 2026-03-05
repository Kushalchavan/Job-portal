import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../service/auth.service";
import { AppError } from "../utils/AppError";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const user = await registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user },
    });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { user },
    });
  },
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});
