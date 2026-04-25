"use client";

import { Menu, GraduationCap } from "lucide-react";
import { useSidebar } from "./SidebarProvider";

export function MobileHeader() {
  const { open } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 shadow-sm lg:hidden">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-slate-400 hover:text-white"
        onClick={open}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 items-center gap-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
          EduAnalytics
        </span>
      </div>
    </header>
  );
}
