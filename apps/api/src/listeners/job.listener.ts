import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractJobSkills } from "../modules/ai/job-parser.service";

eventEmitter.on(EVENTS.JOB_CREATED_EVENT, async (payload) => {
  try {
    console.log("Job created event received:", payload);

    const job = await prisma.job.findUnique({
      where: {
        id: payload.jobId,
      },
    });

    if (!job) {
      return;
    }

    const result = await extractJobSkills(job.description);

    console.log(result);
  } catch (error) {
    console.error(error);
  }
});
