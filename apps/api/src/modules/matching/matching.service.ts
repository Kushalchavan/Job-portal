import { emitCandidateStatusUpdated } from "../../events/matching.event";
import {
  getCandidatesByStatus,
  getMatchesByJobId,
  getMatchesByResumeId,
  getPipelineByJobId,
  getTopCandidatesByJobId,
  updateMatchStatus,
} from "./matching.repository";
import { CandidateStatus } from "@prisma/client";

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

export const getTopCandidates = async (jobId: number) => {
  const matches = await getTopCandidatesByJobId(jobId);

  return matches.map((match) => ({
    resumeName: match.resume.originalName,
    score: match.score,
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
  }));
};

export const getResumeMatches = async (resumeId: string) => {
  const matches = await getMatchesByResumeId(resumeId);

  return matches.map((match) => ({
    jobId: match.job.id,
    jobTitle: match.job.title,
    location: match.job.location,
    employmentType: match.job.employmentType,
    score: match.score,
    matchedSkills: match.matchedSkills,
    missingSkills: match.missingSkills,
  }));
};

export const changeMatchStatus = async (
  matchId: string,
  status: CandidateStatus,
) => {
  const updatedMatch = await updateMatchStatus(matchId, status);

  emitCandidateStatusUpdated(matchId, status);

  return updatedMatch;
};

export const getCandidatesByPipeline = async (
  jobId: number,
  status: CandidateStatus,
) => {
  return getCandidatesByStatus(jobId, status);
};

export const getCandidatePipeline = async (jobId: number) => {
  const pipeline = await getPipelineByJobId(jobId);

  const result = {
    matched: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  };

  for (const item of pipeline) {
    switch (item.status) {
      case "MATCHED":
        result.matched = item._count.status;
        break;

      case "SHORTLISTED":
        result.shortlisted = item._count.status;
        break;

      case "INTERVIEW":
        result.interview = item._count.status;
        break;

      case "HIRED":
        result.hired = item._count.status;
        break;

      case "REJECTED":
        result.rejected = item._count.status;
        break;
    }
  }

  return result;
};
