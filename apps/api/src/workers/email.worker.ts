import { Worker } from "bullmq";
import { sendEmail } from "../mail/mail.service";
import { env } from "../config/env";
import logger from "../config/logger";

new Worker(
  "emails",
  async (job) => {
    await sendEmail(job.data.to, job.data.subject, job.data.html);

    logger.info("Email sent successfully", { recipient: job.data.to });
  },
  {
    connection: {
      host: env.redisHost,
      port: env.redisPort,
    },
  },
);
