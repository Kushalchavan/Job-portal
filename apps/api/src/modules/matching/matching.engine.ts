import { calculateMatchScore } from "./matching.service";
import { createResumeMatch, getActiveJobs } from "./matching.repository";

export const matchResumeAgainstJobs = async (
  resumeId: string,
  resumeSkills: string[],
) => {
  const jobs = await getActiveJobs();

  console.log(`Found ${jobs.length} active jobs`);

  for (const job of jobs) {
    console.log("=================================");
    console.log("Resume Skills:", resumeSkills);
    console.log("Job Skills:", job.requiredSkills);
    console.log("=================================");

    const matchResult = calculateMatchScore(resumeSkills, job.requiredSkills);

    console.log("=================================");
    console.log("Job:", job.title);
    console.log("Match Result:", matchResult);

    if (matchResult.score === 0) {
      continue;
    }

    const savedMatch = await createResumeMatch({
      resumeId,
      jobId: job.id,
      score: matchResult.score,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      summary: "",
    });

    console.log("=================================");
    console.log("ResumeMatch Saved:");
    console.log(savedMatch);
    console.log("=================================");
  }
};
