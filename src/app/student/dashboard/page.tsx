import { getStudentDashboardData } from "@/features/submissions/actions";
import { StudentAnalytics } from "@/components/StudentAnalytics";
import { BookOpen, CheckCircle2, Clock3, ArrowRight } from "lucide-react";
import Link from "next/link";

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
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">Performance Analytics</h1>
          <p className="text-xs text-slate-400">
            Monitor your progression and learning metrics
          </p>
        </div>
        <Link 
          href="/student/assignments" 
          className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          View Assignments <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Curricula</p>
              <p className="mt-1 text-3xl font-bold text-white">
                {assignments.length}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Mastered</p>
              <p className="mt-1 text-3xl font-bold text-green-400">
                {acceptedCount}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 p-6 flex items-start gap-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
              <Clock3 className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">
                In Review
              </p>
              <p className="mt-1 text-3xl font-bold text-amber-400">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Progress Insights</h2>
          </div>
          <StudentAnalytics assignments={assignments} submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
