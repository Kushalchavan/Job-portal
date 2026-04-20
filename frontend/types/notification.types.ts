export type NotificationType = "APPLICATION_CREATED" | "JOB_ALERT";

export interface Notification {
  id: string;
  userId: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
}