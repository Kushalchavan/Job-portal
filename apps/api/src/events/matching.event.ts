import { eventEmitter } from "./eventEmitter";
import { CandidateStatus } from "@prisma/client";
import { EVENTS } from "./events.contants";
import logger from "../config/logger";

export const emitCandidateStatusUpdated = (
  matchId: string,
  status: CandidateStatus,
) => {
  logger.info("Emitting candidate status updated event", {
    matchId,
    status,
  });

  eventEmitter.emit(EVENTS.CANDIDATE_STATUS_UPDATED, {
    matchId,
    status,
  });
};
