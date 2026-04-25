import { getInstructorDashboardData } from "@/features/assignments/actions";
import type { AssignmentPayload } from "@/features/types";
import Link from "next/link";
import {
  PlusCircle,
  FileStack,
  BarChart3,
  CheckCircle2,
  Users,
} from "lucide-react";

// Force dynamic since we use getServerSession inside
export const dynamic = "force-dynamic";

export default async function InstructorDashboard() {
  const {
    assignments,
    pendingSubmissionsCount,
    totalSubmissions,
    acceptedCount,
    totalStudents,
  } = await getInstructorDashboardData();

  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round((acceptedCount / totalSubmissions) * 100)
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-8">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          <p className="text-xs text-slate-400">
            Overview of your assignments &amp; class activity
          </p>
        </div>
        <Link
          href="/instructor/assignments/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:opacity-90 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          New Assignment
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* Total Assignments */}
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15">
              <FileStack className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Assignments
              </p>
              <p className="mt-1 text-3xl font-bold text-white">
                {assignments.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">Published so far</p>
            </div>
          </div>

          {/* Total Reviews (Submissions) */}
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                Total Submissions
              </p>
              <p className="mt-1 text-3xl font-bold text-blue-400">
                {totalSubmissions}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-amber-400 font-medium">
                  {pendingSubmissionsCount} pending
                </span>
                {pendingSubmissionsCount > 0 && (
                  <Link
                    href="/instructor/submissions"
                    className="text-[10px] text-fuchsia-500 hover:text-fuchsia-400 underline underline-offset-2"
                  >
                    Review →
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Accepted / Acceptance Rate */}
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Accepted</p>
              <p className="mt-1 text-3xl font-bold text-green-400">
                {acceptedCount}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {acceptanceRate}% acceptance rate
              </p>
            </div>
          </div>

          {/* Total Students */}
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <Users className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                Active Students
              </p>
              <p className="mt-1 text-3xl font-bold text-violet-400">
                {totalStudents}
              </p>
              <p className="mt-1 text-xs text-slate-500">Who submitted work</p>
            </div>
          </div>
        </div>

        {/* Assignments table */}
        <div className="rounded-2xl bg-[#151025] border border-slate-800/60 overflow-hidden">
          <div className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                All Assignments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Shared across all instructors — anyone can edit
              </p>
            </div>
            <Link
              href="/instructor/assignments/new"
              className="text-xs font-medium text-fuchsia-500 hover:text-fuchsia-400"
            >
              + Add new
            </Link>
          </div>
          <ul role="list" className="divide-y divide-slate-800/60">
            {assignments.length === 0 ? (
              <li className="px-6 py-10 text-center text-slate-400 text-sm">
                No assignments yet. Create your first one!
              </li>
            ) : (
              assignments.map((assignment) => (
                <li
                  key={assignment._id}
                  className="px-6 py-4 hover:bg-[#1A142B]/60 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {assignment.title}
                      </p>

                      {/* Attribution badges */}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {/* Created by */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 text-[10px] font-medium text-fuchsia-300">
                          <span className="opacity-60">Created by</span>
                          {typeof assignment.instructorId === "string"
                            ? assignment.instructorId
                            : (assignment.instructorId?.name ?? "Unknown")}
                        </span>

                        {/* Last edited by — only show if different from creator or if editHistory has >1 entry */}
                        {assignment.lastEditedBy &&
                          typeof assignment.lastEditedBy !== "string" &&
                          typeof assignment.instructorId !== "string" &&
                          assignment.instructorId &&
                          assignment.lastEditedBy._id !==
                            assignment.instructorId._id && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                              <span className="opacity-60">Edited by</span>
                              {typeof assignment.lastEditedBy === "string"
                                ? assignment.lastEditedBy
                                : (assignment.lastEditedBy?.name ?? "Unknown")}
                            </span>
                          )}

                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            assignment.difficulty === "beginner"
                              ? "bg-green-400/10 text-green-400"
                              : assignment.difficulty === "intermediate"
                                ? "bg-yellow-400/10 text-yellow-500"
                                : "bg-rose-400/10 text-rose-400"
                          }`}
                        >
                          {assignment.difficulty}
                        </span>

                        {assignment.tags && assignment.tags.length > 0 && (
                          <span className="text-[10px] text-slate-500">
                            {assignment.tags.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right side: due date + edit link */}
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-slate-400">
                        Due {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <Link
                        href={`/instructor/assignments/${assignment._id}/edit`}
                        className="mt-1 inline-block text-[10px] font-medium text-fuchsia-500 hover:text-fuchsia-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Edit →
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
