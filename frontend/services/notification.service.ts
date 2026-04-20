import api from "@/lib/api";
import { Notification } from "@/types/notification.types";

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};
