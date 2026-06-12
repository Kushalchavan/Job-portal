"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold">Welcome {user?.name}</h1>

        <p className="mt-2 text-muted-foreground">Role: {user?.role}</p>

        {user?.role === "USER" && (
          <div className="mt-6 flex gap-4">
            <Link href="/jobs" className="rounded border px-4 py-2">
              Browse Jobs
            </Link>

            <Link href="/saved-jobs" className="rounded border px-4 py-2">
              Saved Jobs
            </Link>
          </div>
        )}

        {user?.role === "RECRUITER" && (
          <div className="mt-6 flex gap-4">
            <Link href="/jobs/create" className="rounded border px-4 py-2">
              Create Job
            </Link>

            <Link href="/jobs/manage" className="rounded border px-4 py-2">
              Manage Jobs
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
