import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";

// Register User
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "USER" | "RECRUITER" | "ADMIN",
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User Already Exists", 400);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
    },
  });

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  return token;
};

// Login User
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new AppError("Email does not exists", 401);
  }

  const matchUser = await bcrypt.compare(password, user.password);
  if (!matchUser) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = signToken({ userId: user.id, role: user.role });

  return token;
};
