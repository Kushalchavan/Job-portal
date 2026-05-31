import { prisma } from "../../config/prisma";

export const getNotificationsByUserId = async (userId: number) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markNotificationAsRead = async (id: string, userId: number) => {
  return prisma.notification.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};
