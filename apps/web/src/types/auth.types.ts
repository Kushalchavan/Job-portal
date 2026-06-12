export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "RECRUITER" | "ADMIN";
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}
