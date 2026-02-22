import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginUser, registerUser } from "../service/auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const user = await registerUser(name, email, password, role);

    res.status(201).json({
      success: true,
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
      data: { user },
    });
  },
);
