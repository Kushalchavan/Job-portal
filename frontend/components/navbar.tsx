"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Briefcase, Sun, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationSidebar from "@/components/notification-sidebar";
import { useNotification } from "@/context/NotificationContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const { setTheme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications } = useNotification();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Briefcase />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">
                Hirely
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                Jobs
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">

              {/* 🔔 Notification Bell */}
              {isAuthenticated && (
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="relative"
                >
                  <Bell size={20}/>

                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              )}

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-5 w-5 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 scale-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Image
                      src="https://i.pravatar.cc/40"
                      alt="user"
                      width={30}
                      height={30}
                      className="rounded-full cursor-pointer"
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <div className="p-3 border-b">
                      <p>{user?.name}</p>
                      <p className="text-xs">{user?.email}</p>
                    </div>

                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login"><Button>Login</Button></Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <NotificationSidebar open={openSidebar} setOpen={setOpenSidebar} />
    </>
  );
}