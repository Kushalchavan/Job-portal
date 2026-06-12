"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          Job Portal
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>

              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}

          {user?.role === "USER" && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/jobs">Jobs</Link>
              <Link href="/saved-jobs">Saved Jobs</Link>

              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/jobs/create">Create Job</Link>
              <Link href="/jobs/manage">My Jobs</Link>

              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link href="/admin">Admin Panel</Link>

              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
