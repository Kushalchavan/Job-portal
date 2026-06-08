import { Worker } from "bullmq";
import { prisma } from "../config/prisma";
import { env } from "../config/env";

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
      host: env.redisHost,
      port: env.redisPort,
    },
  },
);
