import logger from "../config/logger";
import { NextFunction, Request, Response } from "express";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;

    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`,
      {
        requestId: req.requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      },
    );
  });

  next();
};
