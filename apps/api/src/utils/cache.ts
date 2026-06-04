import { redisConnection } from "../config/redis";

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redisConnection.get(key);

  if (!cachedData) {
    return null;
  }

  return JSON.parse(cachedData) as T;
};

export const setCache = async (key: string, data: unknown, ttl = 60) => {
  await redisConnection.set(key, JSON.stringify(data), "EX", ttl);
};

export const deleteCache = async (key: string) => {
  await redisConnection.del(key);
};

export const clearJobsCache = async () => {
  const keys = await redisConnection.keys("jobs:*");

  if (keys.length > 0) {
    await redisConnection.del(...keys);
  }
};
