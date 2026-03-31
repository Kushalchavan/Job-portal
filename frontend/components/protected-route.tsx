"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = useAuth();

  useEffect(() => {
    if (isAuth === false) {
      router.push("/login");
    }
  }, [isAuth, router]);

  if (isAuth === null) return <p>Loading...</p>;

  return <>{children}</>;
}