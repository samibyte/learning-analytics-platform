import { getFilteredAssignmentsAction } from "@/features/assignments/actions";
import { AssignmentFilters } from "@/components/AssignmentFilters";
import { InstructorAssignmentList } from "@/components/InstructorAssignmentList";
import Link from "next/link";
import { PlusCircle, Database } from "lucide-react";

export const dynamic = "force-dynamic";

interface AllAssignmentsPageProps {
  searchParams: Promise<{
    search?: string;
    difficulty?: string;
    sort?: string;
  }>;
}

export default async function AllAssignmentsPage({ searchParams }: AllAssignmentsPageProps) {
  // Await the search parameters 
  const params = await searchParams;

  const assignments = await getFilteredAssignmentsAction({
    search: params.search,
    difficulty: params.difficulty,
    sort: params.sort,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-4 border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-0">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">All Assignments</h1>
          <p className="text-xs text-slate-400">
            Manage, filter, and search standard curriculum assignments
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 space-y-6">
        
        {/* Filters Section */}
        <AssignmentFilters />

        {/* Assignments List */}
        <div className="rounded-2xl bg-[#151025] border border-slate-800/60 overflow-hidden">
          <div className="border-b border-slate-800/60 px-4 md:px-6 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
               <Database className="w-4 h-4 text-fuchsia-500" />
               Current Curriculum
            </h2>
            <div className="text-xs font-medium text-slate-500">
               {assignments.length} Results
            </div>
          </div>
          <InstructorAssignmentList assignments={assignments} />
        </div>

      </div>
    </div>
  );
}
