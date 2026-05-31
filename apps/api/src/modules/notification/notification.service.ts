import {
  getNotificationsByUserId,
  markNotificationAsRead,
} from "./notification.repository";

export const getUserNotifications = async (userId: number) => {
  return getNotificationsByUserId(userId);
};

export const readUserNotification = async (
  id: string,
  userId: number,
) => {
  return markNotificationAsRead(id, userId);
};