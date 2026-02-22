import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: number;
  role: string;
}

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};