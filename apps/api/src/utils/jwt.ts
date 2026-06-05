import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  id: number;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
};
