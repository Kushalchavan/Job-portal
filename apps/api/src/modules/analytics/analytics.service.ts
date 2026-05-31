import { getAnalyticsData } from "./analytics.repository";

export const getAnalytics = async () => {
  const { jobs, resumes, matches } = await getAnalyticsData();

  const jobSkills = jobs.flatMap((job) => job.requiredSkills);
  const resumeSkills = resumes.flatMap((resume) => resume.skills);

  const jobSkillCounts: Record<string, number> = {};
  const resumeSkillCounts: Record<string, number> = {};

  for (const skill of jobSkills) {
    jobSkillCounts[skill] = (jobSkillCounts[skill] || 0) + 1;
  }

  for (const skill of resumeSkills) {
    resumeSkillCounts[skill] = (resumeSkillCounts[skill] || 0) + 1;
  }

  const averageMatchScore =
    matches.length === 0
      ? 0
      : Math.round(
          matches.reduce((sum, match) => sum + match.score, 0) / matches.length,
        );

  return {
    topJobSkills: Object.entries(jobSkillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),

    topResumeSkills: Object.entries(resumeSkillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),

    averageMatchScore,
  };
};
