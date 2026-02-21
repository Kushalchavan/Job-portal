import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export const signToken = (payload: object) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
