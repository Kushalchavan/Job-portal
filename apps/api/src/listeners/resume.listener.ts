import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractTextFromPDF } from "../utils/pdf";

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

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        status: "COMPLETED",
        extractedText: await extractTextFromPDF(payload.storageKey),
      },
    });
  } catch (error) {
    console.error(error);

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
