export const cleanAIResponse = (response: string) => {
  return response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};
