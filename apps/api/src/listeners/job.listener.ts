import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractSkills } from "../utils/extractSkills";

eventEmitter.on(EVENTS.JOB_CREATED_EVENT, async (payload) => {
  try {
    console.log("Job created event received:", payload);

    const job = await prisma.job.findUnique({
      where: {
        id: payload.jobId,
      },
    });

    if (!job) {
      console.log("Job not found");
      return;
    }

    console.log("=================================");
    console.log("Job Description:");
    console.log(job.description);

    const skills = extractSkills(job.description);

    console.log("=================================");
    console.log("Extracted Skills:");
    console.log(skills);
    console.log("=================================");

    await prisma.job.update({
      where: {
        id: job.id,
      },
      data: {
        requiredSkills: skills,
      },
    });

    console.log("Required skills updated successfully");
  } catch (error) {
    console.error("Job processing failed:", error);
  }
});
