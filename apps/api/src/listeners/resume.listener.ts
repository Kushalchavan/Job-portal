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

    // Extract PDF text
    const extractedText = await extractTextFromPDF(payload.storageKey);

    console.log("Extracted Text Length:", extractedText.length);

    console.log(
      "Extracted Text (First 500 Characters):",
      extractedText.substring(0, 500),
    );

    // Deterministic extraction (always works)
    const deterministicSkills = extractSkills(extractedText);

    let aiSkills: string[] = [];
    let parsedResume = null;

    // AI skill extraction
    try {
      aiSkills = await extractResumeSkills(extractedText);
    } catch (error) {
      console.error("AI skill extraction failed:", error);
    }

    // AI resume parsing
    try {
      parsedResume = await parseResume(extractedText);
    } catch (error) {
      console.error("Resume parsing failed:", error);
    }

    // Fallback to deterministic skills
    const skillsToMatch = aiSkills.length > 0 ? aiSkills : deterministicSkills;

    console.log("=================================");
    console.log("Deterministic Skills:");
    console.log(deterministicSkills);

    console.log("=================================");
    console.log("AI Skills:");
    console.log(aiSkills);

    console.log("=================================");
    console.log("Skills Used For Matching:");
    console.log(skillsToMatch);

    console.log("=================================");
    console.log("Parsed Resume:");
    console.log(parsedResume);

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
