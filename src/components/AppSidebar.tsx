"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  FileText,
  BookOpen,
  LogOut,
  GraduationCap,
  ChevronRight,
  X,
} from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Role = "instructor" | "student";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const INSTRUCTOR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "Assignments", href: "/instructor/assignments", icon: FileText },
  { label: "Submissions", href: "/instructor/submissions", icon: ClipboardList },
];

const STUDENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Assignments", href: "/student/assignments", icon: BookOpen },
];

interface AppSidebarProps {
  role: Role;
  userName: string;
  userEmail: string;
}

export function AppSidebar({ role, userName, userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const navItems = role === "instructor" ? INSTRUCTOR_NAV : STUDENT_NAV;

  // Close sidebar when route changes
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0F0A1A]/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0D0919] border-r border-slate-800/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/20">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              EduAnalytics
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={close}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          role === "instructor"
            ? "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/20"
            : "bg-violet-500/15 text-violet-300 border border-violet-500/20"
        }`}>
          <span className="relative flex h-1.5 w-1.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${role === "instructor" ? "bg-fuchsia-400" : "bg-violet-400"}`} />
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${role === "instructor" ? "bg-fuchsia-400" : "bg-violet-400"}`} />
          </span>
          {role === "instructor" ? "Instructor" : "Student"}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Sidebar navigation">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href.split("/").length > 2);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-fuchsia-500/20 to-violet-500/10 text-white border border-fuchsia-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                  isActive ? "text-fuchsia-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-fuchsia-400/60" />
              )}
              {/* Active left accent bar */}
              {isActive && (
                <span className="absolute left-0 inset-y-1 w-0.5 rounded-r-full bg-gradient-to-b from-fuchsia-400 to-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="border-t border-slate-800/60 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-3 py-3 mb-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-xs font-bold text-white">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400 group"
        >
          <LogOut className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}
