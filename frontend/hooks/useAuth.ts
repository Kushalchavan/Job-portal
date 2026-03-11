import { getToken } from "@/lib/auth";

export const isAuthenticated = () => {
  return !!getToken();
};
