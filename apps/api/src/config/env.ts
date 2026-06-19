import dotenv from "dotenv";
import { z } from "zod";
import logger from "./logger";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
  JWT_REFRESH_SECRET: z.string().min(10),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error("Invalid env variables", {
    errors: parsedEnv.error.format(),
  });
  process.exit(1);
}

export const env = {
  port: Number(parsedEnv.data.PORT),
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  nodeEnv: parsedEnv.data.NODE_ENV,
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isTest: parsedEnv.data.NODE_ENV === "test",
  SMTP_HOST: parsedEnv.data.SMTP_HOST,
  SMTP_PORT: parsedEnv.data.SMTP_PORT,
  SMTP_USER: parsedEnv.data.SMTP_USER,
  SMTP_PASS: parsedEnv.data.SMTP_PASS,
  SMTP_FROM: parsedEnv.data.SMTP_FROM,
  jwtRefreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
  redisHost: parsedEnv.data.REDIS_HOST,
  redisPort: Number(parsedEnv.data.REDIS_PORT),
  redisPassword: parsedEnv.data.REDIS_PASSWORD,
};
