import { generateText } from "./gemini.service";
import { parsedResumeSchema, skillsSchema } from "./resume-parser.schema";
import { cleanAIResponse } from "./json-parser";

export const extractResumeSkills = async (resumeText: string) => {
  const prompt = `
Extract technical skills from the following resume text.

Return ONLY a JSON array.

Example:
["Node.js", "PostgreSQL", "Redis"]

Resume Text:
${resumeText}
`;

  const response = await generateText(prompt);
  const cleanedResponse = cleanAIResponse(response);
  const parsedResponse = JSON.parse(cleanedResponse);

  const validatedResponse = skillsSchema.parse(parsedResponse);

  return validatedResponse;
};

export const parseResume = async (resumeText: string) => {
  const prompt = `
You are an AI resume parser.

Extract structured information from this resume.

Return ONLY valid JSON.

Schema:
{
  "summary": string,
  "skills": string[],
  "experience": string[],
  "education": string[],
  "projects": string[]
}

Resume:
${resumeText}
`;

  const response = await generateText(prompt);
  const cleanedResponse = cleanAIResponse(response);
  const parsedResponse = JSON.parse(cleanedResponse);

  const validatedResponse = parsedResumeSchema.parse(parsedResponse);

  return validatedResponse;
};
