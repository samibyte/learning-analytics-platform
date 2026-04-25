import { getStudentDashboardData } from "@/features/submissions/actions";
import type { AssignmentPayload, SubmissionPayload } from "@/features/types";
import Link from "next/link";
import { BookOpen, CheckCircle2, Clock3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const { assignments, submissions } = await getStudentDashboardData();

  const acceptedCount = submissions.filter(
    (s) => s.status === "accepted",
  ).length;
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-8">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">My Dashboard</h1>
          <p className="text-xs text-slate-400">
            Track your assignments &amp; submission status
          </p>
        </div>
      </header>

      <div className="flex-1 p-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Assignments</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {assignments.length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Accepted</p>
              <p className="mt-1 text-3xl font-bold text-green-400">
                {acceptedCount}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
              <Clock3 className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                Pending Review
              </p>
              <p className="mt-1 text-3xl font-bold text-amber-400">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        {/* Assignments list */}
        <div className="rounded-2xl bg-[#151025] border border-slate-800/60 overflow-hidden">
          <div className="border-b border-slate-800/60 px-6 py-4">
            <h2 className="text-base font-semibold text-white">
              Available Assignments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your work and track instructor feedback below.
            </p>
          </div>
          <ul role="list" className="divide-y divide-slate-800/60">
            {assignments.length === 0 ? (
              <li className="px-6 py-10 text-center text-slate-400 text-sm">
                No assignments available yet. Check back soon!
              </li>
            ) : (
              assignments.map((assignment) => {
                const submission = submissions.find(
                  (s) => s.assignmentId === assignment._id,
                );
                return (
                  <li
                    key={assignment._id}
                    className="px-6 py-5 hover:bg-[#1A142B]/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {assignment.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {assignment.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              assignment.difficulty === "beginner"
                                ? "bg-green-400/10 text-green-400"
                                : assignment.difficulty === "intermediate"
                                  ? "bg-yellow-400/10 text-yellow-500"
                                  : "bg-rose-400/10 text-rose-400"
                            }`}
                          >
                            {assignment.difficulty}
                          </span>
                          {assignment.tags?.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-slate-500">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {!submission ? (
                          <Link
                            href={`/student/assignments/${assignment._id}/submit`}
                            className="inline-flex items-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 transition-all"
                          >
                            Submit Now
                          </Link>
                        ) : (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              submission.status === "accepted"
                                ? "bg-green-400/10 text-green-400 border border-green-400/20"
                                : submission.status === "needs_improvement"
                                  ? "bg-rose-400/10 text-rose-400 border border-rose-400/20"
                                  : "bg-yellow-400/10 text-yellow-500 border border-yellow-400/20"
                            }`}
                          >
                            {submission.status === "needs_improvement"
                              ? "Needs Improvement"
                              : submission.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {submission?.feedback && (
                      <div className="mt-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-fuchsia-400 uppercase tracking-wider mb-1">
                          Instructor Feedback
                        </p>
                        <p className="text-sm text-slate-300">
                          {submission.feedback}
                        </p>
                        {submission.status === "needs_improvement" && (
                          <Link
                            href={`/student/assignments/${assignment._id}/submit`}
                            className="mt-2 inline-block text-xs font-medium text-fuchsia-400 hover:text-fuchsia-300 underline underline-offset-2"
                          >
                            Resubmit Assignment →
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
