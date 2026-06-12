export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "USER";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}