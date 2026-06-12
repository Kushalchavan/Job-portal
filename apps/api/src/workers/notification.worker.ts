import { Worker } from "bullmq";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import logger from "../config/logger";
import { notificationCreatedCounter } from "../metrics/app.metrics";

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

    // Increment the notification created counter for prometheus metric
    notificationCreatedCounter.inc();

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
