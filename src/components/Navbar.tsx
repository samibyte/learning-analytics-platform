"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-800/60 bg-[#0F0A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
                EduAnalytics
              </span>
            </Link>
            
            {session && (
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {session.user.role === "instructor" ? (
                  <>
                    <Link
                      href="/instructor/dashboard"
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        pathname.includes("/instructor/dashboard")
                          ? "border-fuchsia-500 text-white"
                          : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/instructor/submissions"
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        pathname.includes("/instructor/submissions")
                          ? "border-fuchsia-500 text-white"
                          : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      Submissions
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        pathname.includes("/student/dashboard")
                          ? "border-fuchsia-500 text-white"
                          : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
             {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">
                  <span className="text-white font-medium">{session.user.name}</span> ({session.user.role})
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="rounded-md bg-[#1A142B] px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-[#251D3D] hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
