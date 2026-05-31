import { eventEmitter } from "./eventEmitter";
import { CandidateStatus } from "@prisma/client";
import { EVENTS } from "./events.contants";

export const emitCandidateStatusUpdated = (
  matchId: string,
  status: CandidateStatus,
) => {
    console.log(`Emitting candidate status updated event for match ${matchId} with status ${status}`);
  eventEmitter.emit(EVENTS.CANDIDATE_STATUS_UPDATED, {
    matchId,
    status,
  });
};
