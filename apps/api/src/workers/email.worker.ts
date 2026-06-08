import { Worker } from "bullmq";
import { sendEmail } from "../mail/mail.service";
import { env } from "../config/env";

new Worker(
  "emails",
  async (job) => {
    await sendEmail(job.data.to, job.data.subject, job.data.html);

    console.log("Email Sent:", job.data.to);
  },
  {
    connection: {
      host: env.redisHost,
      port: env.redisPort,
    },
  },
);
