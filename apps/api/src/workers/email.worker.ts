import { Worker } from "bullmq";
import { sendEmail } from "../mail/mail.service";

new Worker(
  "emails",
  async (job) => {
    await sendEmail(
      job.data.to,
      job.data.subject,
      job.data.html,
    );

    console.log(
      "Email Sent:",
      job.data.to,
    );
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);