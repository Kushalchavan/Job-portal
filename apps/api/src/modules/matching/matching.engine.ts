import { calculateMatchScore } from "./matching.service";
import { createResumeMatch, getActiveJobs } from "./matching.repository";
import logger from "../../config/logger";

export const matchResumeAgainstJobs = async (
  resumeId: string,
  resumeSkills: string[],
) => {
  const jobs = await getActiveJobs();

  logger.info("Found active jobs for matching", {
    resumeId,
    resumeSkillsCount: resumeSkills.length,
    activeJobsCount: jobs.length,
  });

  for (const job of jobs) {
    logger.info("Matching resume against job", {
      resumeId,
      jobId: job.id,
      resumeSkillsCount: resumeSkills.length,
      jobSkillsCount: job.requiredSkills.length,
    });

    // calculate match score based on skills
    const matchResult = calculateMatchScore(resumeSkills, job.requiredSkills);

    logger.info("Match result calculated", {
      resumeId,
      jobId: job.id,
      score: matchResult.score,
      matchedSkillsCount: matchResult.matchedSkills.length,
      missingSkillsCount: matchResult.missingSkills.length,
    });

    if (matchResult.score === 0) {
      continue;
    }

    const summary = `
Matched ${matchResult.matchedSkills.length} skills:
${matchResult.matchedSkills.join(", ")}

Missing:
${matchResult.missingSkills.join(", ")}
`;

    const savedMatch = await createResumeMatch({
      resumeId,
      jobId: job.id,
      score: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      summary,
    });

    logger.info("Resume matched with job", {
      resumeId,
      jobId: job.id,
      matchId: savedMatch.id,
      score: matchResult.score,
    });
  }
};
