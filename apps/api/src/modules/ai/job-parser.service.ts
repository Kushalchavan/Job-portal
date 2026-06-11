import { generateText } from "./gemini.service";
import logger from "../../config/logger";

export const extractJobSkills = async (
  description: string,
): Promise<string[]> => {
  const prompt = `
Extract technical skills from the following job description.

Return ONLY a JSON array.

Example:
["Node.js", "PostgreSQL", "Redis"]

Job Description:
${description}
`;

  const response = await generateText(prompt);

  const parsedResponse = JSON.parse(response);

  logger.info("Extracted skills from job description", {
    descriptionLength: description.length,
    extractedSkillsCount: parsedResponse.length,
  });

  return parsedResponse;
};
