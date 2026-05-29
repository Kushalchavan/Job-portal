import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractTextFromPDF } from "../utils/pdf";
import { extractSkills } from "../utils/extractSkills";
import { parseResumeWithAI } from "../modules/ai/ai.service";

eventEmitter.on(EVENTS.RESUME_UPLOADED_EVENT, async (payload) => {
  try {
    console.log("Resume uploaded event received:", payload);

    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    const extractedText = await extractTextFromPDF(payload.storageKey);
    const skills = extractSkills(extractedText);
    const parsedResume = await parseResumeWithAI(extractedText);

    console.log(parsedResume);
    console.log(skills);

    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        extractedText,
        skills,
        parsedData: parsedResume,
        status: "COMPLETED",
      },
    });

    console.log("Resume processed successfully");
  } catch (error) {
    console.error("Resume processing failed:", error);

    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        status: "FAILED",
      },
    });
  }
});
