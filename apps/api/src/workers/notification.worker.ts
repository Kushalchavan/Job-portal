import { Worker } from "bullmq";
import { prisma } from "../config/prisma";

new Worker(
  "notifications",
  async (job) => {
    await prisma.notification.create({
      data: {
        userId: job.data.userId,
        type: job.data.type,
        message: job.data.message,
      },
    });

    console.log("Notification Created:", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
