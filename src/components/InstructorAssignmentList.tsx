"use client";

import { useState } from "react";
import { AssignmentDetailModal } from "@/components/AssignmentDetailModal";
import Link from "next/link";
import type { AssignmentPayload } from "@/features/types";

interface InstructorAssignmentListProps {
  assignments: AssignmentPayload[];
}

export function InstructorAssignmentList({
  assignments,
}: InstructorAssignmentListProps) {
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
            No assignments yet. Create your first one!
          </li>
        ) : (
          assignments.map((assignment) => (
            <li
              key={assignment._id}
              className="px-6 py-4 hover:bg-[#1A142B]/60 transition-colors group cursor-pointer"
              onClick={() => openModal(assignment)}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            </li>
          ))
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
