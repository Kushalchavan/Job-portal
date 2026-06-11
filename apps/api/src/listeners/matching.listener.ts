import logger from "../config/logger";
import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { getMatchById } from "../modules/matching/matching.repository";

eventEmitter.on(
  EVENTS.CANDIDATE_STATUS_UPDATED,
  async ({ matchId, status }) => {
    const match = await getMatchById(matchId);

    if (!match) {
      return;
    }

    await prisma.notification.create({
      data: {
        userId: match.resume.userId,
        type: "JOB_ALERT",
        message: `Your application for ${match.job.title} has been ${status.toLowerCase()}.`,
      },
    });

    logger.info("Notification created", {
      resumeId: match.resumeId,
      jobId: match.jobId,
      status,
    });
  },
);
