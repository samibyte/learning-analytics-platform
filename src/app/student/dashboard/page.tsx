import { getStudentDashboardData } from "@/features/submissions/actions";
import { StudentAssignmentList } from "@/components/StudentAssignmentList";
import type { AssignmentPayload, SubmissionPayload } from "@/features/types";
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
              Click to view details or submit your work
            </p>
          </div>
          <StudentAssignmentList
            assignments={assignments}
            submissions={submissions}
          />
        </div>
      </div>
    </div>
  );
}
