import { prisma } from "../../config/prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "RECRUITER" | "ADMIN";
}) => {
  return prisma.user.create({
    data,
  });
};

export const findUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const createRefreshToken = async (
  token: string,
  userId: number,
  expiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const findRefreshToken = async (
  token: string,
) => {
  return prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
};

export const deleteRefreshToken = async (
  token: string,
) => {
  return prisma.refreshToken.delete({
    where: {
      token,
    },
  });
};

export const deleteAllRefreshTokensByUserId =
  async (userId: number) => {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  };