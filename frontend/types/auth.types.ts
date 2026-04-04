export type Role = "USER" | "RECRUITER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}
