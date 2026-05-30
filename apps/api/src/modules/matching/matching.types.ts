export interface MatchResult {
  score: number;

  matchedSkills: string[];
  missingSkills: string[];

  experienceMatch: boolean;
  titleMatch: boolean;

  strengths: string[];
  concerns: string[];

  recommendation: "INTERVIEW" | "MAYBE" | "REJECT";

  summary: string;
}