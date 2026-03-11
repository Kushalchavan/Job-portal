import api from "@/lib/api";
import { AuthResponse, LoginInput, RegisterInput } from "@/types";

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerUser = async (
  data: RegisterInput,
): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
