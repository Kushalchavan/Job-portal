import IORedis from "ioredis";
import { env } from "./env";

export const redisConnection = new IORedis({
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  maxRetriesPerRequest: null,
});
