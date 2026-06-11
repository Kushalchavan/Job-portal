import { Queue } from "bullmq";
import { env } from "../config/env";

export interface NotificationJobData {
  userId: number;
  type: string;
  message: string;
  requestId: string;
}

export const notificationQueue = new Queue<NotificationJobData>(
  "notifications",
  {
   connection: {
         host: env.redisHost,
         port: env.redisPort,
       },
  },
);
