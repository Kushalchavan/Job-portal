import { generateText } from "./gemini.service";

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

  console.log("=================================");
  console.log("RAW GEMINI RESPONSE:");
  console.log(response);
  console.log("=================================");

  return parsedResponse;
};
