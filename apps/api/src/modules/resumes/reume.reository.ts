import { prisma } from "../../config/prisma";

interface CreateResumeInput {
  userId: number;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  requestId: string;
}

export const createResumeRepo = async (data: CreateResumeInput) => {
  return prisma.resume.create({
    data,
  });
};

export const getUserResumesRepo = async (userId: number) => {
  return prisma.resume.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getResumeByIdRepo = async (resumeId: string) => {
  return prisma.resume.findUnique({
    where: {
      id: resumeId,
    },
  });
};

export const deleteResumeRepo = async (resumeId: string) => {
  return prisma.resume.delete({
    where: {
      id: resumeId,
    },
  });
};
