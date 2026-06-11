import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractSkills } from "../utils/extractSkills";
import logger from "../config/logger";

eventEmitter.on(EVENTS.JOB_CREATED_EVENT, async (payload) => {
  try {
    logger.info("Job created event received", { jobId: payload.jobId });

    const job = await prisma.job.findUnique({
      where: {
        id: payload.jobId,
      },
    });

    if (!job) {
      logger.warn("Job not found", { jobId: payload.jobId });
      return;
    }

    logger.info("Job Description:", {
      jobId: payload.jobId,
      description: job.description.length,
    });

    const skills = extractSkills(job.description);

    await prisma.job.update({
      where: {
        id: job.id,
      },
      data: {
        requiredSkills: skills,
      },
    });

    logger.info("Required skills updated successfully", {
      jobId: payload.jobId,
    });
  } catch (error) {
    logger.error("Job processing failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
});
