import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractTextFromPDF } from "../utils/pdf";
import { extractSkills } from "../utils/extractSkills";

import {
  extractResumeSkills,
  parseResume,
} from "../modules/ai/resume-parser.service";

eventEmitter.on(EVENTS.RESUME_UPLOADED_EVENT, async (payload) => {
  try {
    console.log("Resume uploaded event received:", payload);

    // Mark as processing
    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(payload.storageKey);
    console.log("Extracted Text Length:", extractedText.length);
    console.log("Extracted Text (First 500 Characters):", extractedText.substring(0, 500));

    // Deterministic skill extraction
    const deterministicSkills = extractSkills(extractedText);

    // AI skill extraction
    const aiSkills = await extractResumeSkills(extractedText);

    // AI resume parsing
    const parsedResume = await parseResume(extractedText);

    console.log("=================================");
    console.log("Deterministic Skills:");
    console.log(deterministicSkills);

    console.log("=================================");
    console.log("AI Skills:");
    console.log(aiSkills);

    console.log("=================================");
    console.log("Parsed Resume:");
    console.log(parsedResume);

    // For now save only deterministic data
    // We will save AI output after validation
    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        extractedText,
        skills: deterministicSkills,
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
