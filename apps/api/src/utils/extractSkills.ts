import { SKILLS } from "../constants/skills";

export const extractSkills = (text: string) => {
  const normalizedText = text.toLowerCase();

  return SKILLS.filter((skill) => normalizedText.includes(skill.toLowerCase()));
};


// For Determinstc Extraction of skills 