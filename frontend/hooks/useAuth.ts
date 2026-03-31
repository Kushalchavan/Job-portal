"use client";

import { useState } from "react";
import { getToken } from "@/lib/auth";

export const useAuth = () => {
  const [isAuth] = useState(() => {
    if (typeof window === "undefined") return null;
    return !!getToken();
  });

  return isAuth;
};