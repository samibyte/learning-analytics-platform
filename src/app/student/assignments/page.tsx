import { getStudentDashboardData } from "@/features/submissions/actions";
import { StudentAssignmentList } from "@/components/StudentAssignmentList";

export const dynamic = "force-dynamic";

export default async function StudentAssignmentsPage() {
  const { assignments, submissions } = await getStudentDashboardData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">My Assignments</h1>
          <p className="text-xs text-slate-400">
            View all available assignments and track your submissions
          </p>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        {/* Assignments list */}
        <div className="rounded-2xl bg-[#151025] border border-slate-800/60 overflow-hidden">
          <div className="border-b border-slate-800/60 px-4 md:px-6 py-4">
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
