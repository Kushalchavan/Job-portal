import { Queue } from "bullmq";
import { env } from "../config/env";

export const emailQueue = new Queue("email", {
  connection: {
    host: env.redisHost,
    port: env.redisPort,
  },
});
