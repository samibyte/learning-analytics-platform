"use client";

import { useState } from "react";
import { AssignmentDetailModal } from "@/components/AssignmentDetailModal";
import Link from "next/link";
import type { AssignmentPayload, SubmissionPayload } from "@/features/types";

interface StudentAssignmentListProps {
  assignments: AssignmentPayload[];
  submissions: SubmissionPayload[];
}

export function StudentAssignmentList({
  assignments,
  submissions,
}: StudentAssignmentListProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<AssignmentPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (assignment: AssignmentPayload) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(null);
  };

  return (
    <>
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
                className="px-6 py-5 hover:bg-[#1A142B]/60 transition-colors group cursor-pointer"
                onClick={() => openModal(assignment)}
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
                        Deadline: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {!submission ? (
                      <Link
                        href={`/student/assignments/${assignment._id}/submit`}
                        className="inline-flex items-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Submit Now
                      </Link>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
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
                        {submission.isLate && (
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                            Late Submission
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-medium">
                          Max Marks: {submission.maxMarks || (submission.isLate ? 30 : 60)}
                        </span>
                      </div>
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
                        onClick={(e) => e.stopPropagation()}
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

      <AssignmentDetailModal
        assignment={selectedAssignment}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
