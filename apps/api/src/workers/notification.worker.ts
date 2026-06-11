import { Worker } from "bullmq";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import logger from "../config/logger";

new Worker(
  "notifications",
  async (job) => {
    await prisma.notification.create({
      data: {
        requestId: job.data.requestId,
        userId: job.data.userId,
        type: job.data.type,
        message: job.data.message,
      },
    });

    logger.info("Notification created successfully", {
      requestId: job.data.requestId,
      userId: job.data.userId,
      type: job.data.type,
    });
  },
  {
    connection: {
      host: env.redisHost,
      port: env.redisPort,
    },
  },
);
