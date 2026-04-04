"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "@/lib/auth";
import { AuthData } from "@/types";

interface AuthContextType {
  user: AuthData["user"] | null;
  token: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthData["user"] | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser && storedUser !== "undefined") {
      setAuthToken(storedToken);

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user in localStorage", error);
        localStorage.removeItem("user"); // cleanup bad data
      }
    }
  }, []);

  const login = (data: AuthData) => {
    // Save to localStorage
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Update state
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");

    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};