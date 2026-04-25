import { getAllSubmissionsForInstructor } from "@/features/submissions/actions";
import { analyzeStudentMorale } from "@/features/submissions/sentiment-actions";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { revalidatePath } from "next/cache";
import { reviewSubmission } from "@/features/submissions/actions";
import { History, UserCheck } from "lucide-react";
import { SubmissionReviewForm } from "./SubmissionReviewForm";

export const dynamic = "force-dynamic";

export default async function InstructorSubmissionsPage() {
  const submissions = await getAllSubmissionsForInstructor();

  // Extract all non-empty notes for sentiment analysis
  const notes = submissions
    .map((s) => s.note)
    .filter(
      (note): note is string =>
        typeof note === "string" && note.trim().length > 0,
    );
  const morale = await analyzeStudentMorale(notes);

  // Server Action inline to handle the review submission
  async function submitReview(formData: FormData) {
    "use server";
    const submissionId = formData.get("submissionId") as string;
    const status = formData.get("status") as
      | "pending"
      | "accepted"
      | "needs_improvement";
    const feedback = formData.get("feedback") as string;

    await reviewSubmission(submissionId, status, feedback);
    revalidatePath("/instructor/submissions");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-4 border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-0">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">
            Submissions &amp; Analytics
          </h1>
          <p className="text-xs text-slate-400">
            Review student submissions and track class performance
          </p>
        </div>
        {/* Morale badge */}
        <div className="hidden sm:flex items-center gap-3 rounded-xl bg-[#151025] border border-slate-800/60 px-4 py-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">
              Class Morale
            </p>
            <p className="text-sm font-bold text-white leading-none mt-0.5">
              {morale.label}
            </p>
          </div>
          <span className="text-xs text-slate-500 border-l border-slate-700 pl-3">
            Score: {morale.averageScore}
          </span>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8">
        <AnalyticsCharts submissions={submissions} />

        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-2xl border border-slate-800/60 bg-[#151025]">
                <table className="min-w-full divide-y divide-slate-800/60">
                  <thead className="bg-[#1A142B]">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                      >
                        Student
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Assignment
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Artifacts
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Action / History
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-[#151025]">
                    {submissions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-sm text-slate-400"
                        >
                          No submissions found.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => (
                        <tr key={sub._id}>
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="font-medium text-white">
                                  {typeof sub.studentId === "string"
                                    ? sub.studentId
                                    : sub.studentId?.name || "Unknown"}
                                </div>
                                <div className="text-slate-400">
                                  {typeof sub.studentId === "string"
                                    ? ""
                                    : sub.studentId?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm">
                            <div className="text-white font-medium">
                              {sub.assignment?.title}
                            </div>
                            <div className="text-slate-400 mt-0.5 uppercase text-[10px]">
                              {sub.assignment?.difficulty}
                            </div>
                            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 px-2 py-0.5 text-[10px] font-medium text-fuchsia-300">
                              <span className="opacity-60">by</span>
                              {typeof sub.assignment?.instructorId === "string"
                                ? sub.assignment.instructorId
                                : (sub.assignment?.instructorId?.name ??
                                  "Unknown")}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm text-slate-300">
                            <div>
                              <a
                                href={sub.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-fuchsia-400 hover:text-fuchsia-300 font-medium underline"
                              >
                                View Repository
                              </a>
                            </div>
                            {sub.liveUrl && (
                              <div className="mt-1">
                                <a
                                  href={sub.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 font-medium underline text-xs"
                                >
                                  View Live Project
                                </a>
                              </div>
                            )}
                            {sub.note && (
                              <div className="mt-2 text-xs italic bg-[#1A142B] p-2 rounded border border-slate-800/60 max-w-[200px] truncate">
                                &quot;{sub.note}&quot;
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-slate-400">
                            <div className="flex flex-col gap-2">
                              <span
                                className={`inline-flex w-fit rounded-full px-2 text-xs font-semibold leading-5 ${
                                  sub.status === "accepted"
                                    ? "bg-green-400/10 text-green-400"
                                    : sub.status === "needs_improvement"
                                      ? "bg-rose-400/10 text-rose-400"
                                      : "bg-yellow-400/10 text-yellow-500"
                                }`}
                              >
                                {sub.status.toUpperCase()}
                              </span>
                              
                              <div className="flex flex-col gap-1">
                                {sub.isLate && (
                                  <span className="inline-flex w-fit items-center rounded-md bg-rose-400/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-400/20">
                                    LATE SUBMISSION
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Max Marks: {sub.maxMarks || (sub.isLate ? 30 : 60)}
                                </span>
                              </div>

                              {sub.reviewedBy && (
                                <div className="mt-1 flex items-center gap-1.5">
                                  <UserCheck className="h-3 w-3 text-blue-400" />
                                  <span className="text-[10px] text-slate-400">
                                    {typeof sub.reviewedBy === "string"
                                      ? sub.reviewedBy
                                      : sub.reviewedBy?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm align-top">
                            <SubmissionReviewForm
                              submissionId={sub._id.toString()}
                              initialStatus={sub.status}
                              initialFeedback={sub.feedback ?? ""}
                              submitReview={submitReview}
                            />

                            {/* History Log */}
                            {sub.reviewHistory &&
                              sub.reviewHistory.length > 1 && (
                                <details className="group">
                                  <summary className="list-none flex items-center gap-1.5 text-[10px] font-medium text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                                    <History className="h-3 w-3" />
                                    View History (
                                    {sub.reviewHistory?.length ?? 0})
                                  </summary>
                                  <div className="mt-2 space-y-2 border-l border-slate-800 pl-3">
                                    {[...(sub.reviewHistory ?? [])]
                                      .reverse()
                                      .map((h, i: number) => (
                                        <div key={i} className="text-[10px]">
                                          <p className="font-semibold text-slate-400">
                                            {h.status.toUpperCase()} by{" "}
                                            {typeof h.reviewedBy === "string"
                                              ? h.reviewedBy
                                              : (h.reviewedBy?.name ??
                                                "Unknown")}
                                          </p>
                                          <p className="text-slate-500 line-clamp-1 italic">
                                            &quot;{h.feedback}&quot;
                                          </p>
                                          <p className="text-[8px] text-slate-600">
                                            {new Date(
                                              h.reviewedAt,
                                            ).toLocaleDateString()}
                                          </p>
                                        </div>
                                      ))}
                                  </div>
                                </details>
                              )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
