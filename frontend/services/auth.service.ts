import api from "@/lib/api";
import { ApiResponse, AuthData, LoginInput, RegisterInput } from "@/types";

export const loginUser = async (data: LoginInput): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/login", data);
  console.log(res.data.data)
  return res.data.data;
};

export const registerUser = async (data: RegisterInput): Promise<AuthData> => {
  const res = await api.post<ApiResponse<AuthData>>("/auth/register", data);
  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get<ApiResponse<AuthData>>("/auth/me");
  return res.data.data;
};
