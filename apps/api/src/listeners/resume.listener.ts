import { prisma } from "../config/prisma";
import { eventEmitter } from "../events/eventEmitter";
import { EVENTS } from "../events/events.contants";
import { extractTextFromPDF } from "../utils/pdf";
import { extractSkills } from "../utils/extractSkills";
import {
  extractResumeSkills,
  parseResume,
} from "../modules/ai/resume-parser.service";
import { matchResumeAgainstJobs } from "../modules/matching/matching.engine";
import logger from "../config/logger";

eventEmitter.on(EVENTS.RESUME_UPLOADED_EVENT, async (payload) => {
  try {
    logger.info("Resume uploaded event received", {
      requestId: payload.requestId,
      resumeId: payload.resumeId,
    });

    await prisma.resume.update({
      where: {
        id: payload.resumeId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    // Extract PDF text
    const extractedText = await extractTextFromPDF(payload.storageKey);

    logger.info("Extracted Text Length:", {
      resumeId: payload.resumeId,
      length: extractedText.length,
    });

    logger.info("Extracted Text (First 500 Characters):", {
      resumeId: payload.resumeId,
      text: extractedText.length,
    });

    // Deterministic extraction (always works)
    const deterministicSkills = extractSkills(extractedText);

    let aiSkills: string[] = [];
    let parsedResume = null;

    // AI skill extraction
    try {
      aiSkills = await extractResumeSkills(extractedText);
    } catch (error) {
      logger.error("AI skill extractionfailed", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    // AI resume parsing
    try {
      parsedResume = await parseResume(extractedText);
    } catch (error) {
      logger.error("Resume parsing failed", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    // Fallback to deterministic skills
    const skillsToMatch = aiSkills.length > 0 ? aiSkills : deterministicSkills;

    // Run matching engine
    await matchResumeAgainstJobs(payload.resumeId, skillsToMatch);

    // Save resume
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

    logger.info("Resume processed successfully", {
      resumeId: payload.resumeId,
    });
  } catch (error) {
    logger.error("Resume processing failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

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
