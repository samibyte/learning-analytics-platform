"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, SortDesc, Loader2 } from "lucide-react";

export function AssignmentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Local state for instant UI updates, synced from URL initially
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Debounced Search Sync
  useEffect(() => {
    const handler = setTimeout(() => {
      updateUrl(search, difficulty, sort);
    }, 300); // 300ms bounce
    return () => clearTimeout(handler);
  }, [search, difficulty, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = (sc: string, diff: string, srt: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sc) params.set("search", sc);
    else params.delete("search");

    if (diff !== "all") params.set("difficulty", diff);
    else params.delete("difficulty");

    if (srt && srt !== "newest") params.set("sort", srt);
    else params.delete("sort");

    startTransition(() => {
       router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#151025] border border-slate-800/60 p-4 rounded-2xl">
      
      {/* Search Input */}
      <div className="relative w-full sm:w-1/3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          className="bg-[#1A1429] border border-slate-800/80 text-white text-sm rounded-xl focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 block w-full pl-9 p-2.5 placeholder-slate-500 outline-none transition-all"
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex w-full sm:w-auto items-center gap-3">
        {/* Loading Spinner during transitions */}
        {isPending && <Loader2 className="w-4 h-4 text-fuchsia-500 animate-spin" />}

        {/* Difficulty Filter */}
        <div className="relative flex items-center bg-[#1A1429] border border-slate-800/80 rounded-xl overflow-hidden px-3 text-sm focus-within:ring-2 ring-fuchsia-500/50 transition-all text-slate-300 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 mr-2 text-slate-500" />
          <select
            className="bg-transparent border-none outline-none py-2.5 pr-4 text-sm w-full sm:w-auto appearance-none cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option className="bg-[#1A1429] text-slate-200" value="all">All Difficulties</option>
            <option className="bg-[#1A1429] text-slate-200" value="beginner">Beginner</option>
            <option className="bg-[#1A1429] text-slate-200" value="intermediate">Intermediate</option>
            <option className="bg-[#1A1429] text-slate-200" value="advanced">Advanced</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center bg-[#1A1429] border border-slate-800/80 rounded-xl overflow-hidden px-3 text-sm focus-within:ring-2 ring-fuchsia-500/50 transition-all text-slate-300 w-full sm:w-auto">
          <SortDesc className="w-3.5 h-3.5 mr-2 text-slate-500" />
          <select
            className="bg-transparent border-none outline-none py-2.5 pr-4 text-sm w-full sm:w-auto appearance-none cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option className="bg-[#1A1429] text-slate-200" value="newest">Newest First</option>
            <option className="bg-[#1A1429] text-slate-200" value="oldest">Oldest First</option>
            <option className="bg-[#1A1429] text-slate-200" value="dueDate_asc">Due Date (Earliest)</option>
            <option className="bg-[#1A1429] text-slate-200" value="dueDate_desc">Due Date (Latest)</option>
            <option className="bg-[#1A1429] text-slate-200" value="title_asc">Title (A-Z)</option>
            <option className="bg-[#1A1429] text-slate-200" value="title_desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
