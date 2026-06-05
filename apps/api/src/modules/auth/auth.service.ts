import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError";
import {
  createUser,
  deleteAllRefreshTokensByUserId,
  deleteRefreshToken,
  findRefreshToken,
  findUserByEmail,
  findUserById,
} from "./auth.repository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { createRefreshToken } from "./auth.repository";


export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "USER" | "RECRUITER" | "ADMIN",
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User Already Exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await createRefreshToken(refreshToken, user.id, expiresAt);

  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Email does not exist", 401);
  }

  if (!user?.isActive) {
    throw new AppError("Your account has been blocked", 403);
  }

  const matchUser = await bcrypt.compare(password, user.password);

  if (!matchUser) {
    throw new AppError("Invalid Credentials", 401);
  }

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await createRefreshToken(refreshToken, user.id, expiresAt);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
};

export const getCurrentUser = async (userId: number) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const savedToken = await findRefreshToken(refreshToken);

    if (!savedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (savedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return {
      accessToken,
    };
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }
};

export const logoutUser = async (
  refreshToken: string,
) => {
  const existingToken =
    await findRefreshToken(
      refreshToken,
    );

  if (!existingToken) {
    throw new AppError(
      "Refresh token not found",
      404,
    );
  }

  await deleteRefreshToken(
    refreshToken,
  );

  return {
    message:
      "Logged out successfully",
  };
};

export const logoutAllDevices = async (
  userId: number,
) => {
  await deleteAllRefreshTokensByUserId(
    userId,
  );

  return {
    message:
      "Logged out from all devices",
  };
};