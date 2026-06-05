import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
} from "./auth.service";
import { AppError } from "../../utils/AppError";

// REGISTER
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const data = await registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  },
);

// LOGIN
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data,
    });
  },
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const data = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data,
    });
  },
);

// GET CURRENT USER
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    const result = await logoutUser(refreshToken);

    res.status(200).json({
      success: true,
      ...result,
    });
  },
);

export const logoutAllController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await logoutAllDevices(req.user.id);

    res.status(200).json({
      success: true,
      ...result,
    });
  },
);
