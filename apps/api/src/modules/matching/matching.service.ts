import { getMatchesByJobId } from "./matching.repository";

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const normalizeSkill = (skill: string) => {
  return skill.toLowerCase().replace(/\./g, "").trim();
};

export const calculateMatchScore = (
  resumeSkills: string[],
  jobSkills: string[],
): MatchResult => {
  // Guard clause
  if (jobSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const normalizedResumeSkills = resumeSkills.map(normalizeSkill);
  const resumeSkillSet = new Set(normalizedResumeSkills);

  // Return original job skill names for better UX
  const matchedSkills = jobSkills.filter((skill) =>
    resumeSkillSet.has(normalizeSkill(skill)),
  );

  const missingSkills = jobSkills.filter(
    (skill) => !resumeSkillSet.has(normalizeSkill(skill)),
  );

  const score = Math.round((matchedSkills.length / jobSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

export const getJobMatches = async (jobId: number) => {
  return getMatchesByJobId(jobId);
};
