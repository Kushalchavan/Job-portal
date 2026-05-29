import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const parseResumeWithAI = async (resumeText: string) => {
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

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response;
};
