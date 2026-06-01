import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError";
import { signToken } from "../../utils/jwt";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./auth.repository";

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

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string,
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Email does not exist", 401);
  }

  const matchUser = await bcrypt.compare(
    password,
    user.password,
  );

  if (!matchUser) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
  };
};

export const getCurrentUser = async (
  userId: number,
) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};