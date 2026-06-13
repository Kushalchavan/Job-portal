import { api } from "@/lib/axios";

export const getMyCompanies = async (accessToken: string) => {
  const response = await api.get("/companies/my", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
