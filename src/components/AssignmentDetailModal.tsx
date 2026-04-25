"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import type { AssignmentPayload } from "@/features/types";

interface AssignmentDetailModalProps {
  assignment: AssignmentPayload | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignmentDetailModal({
  assignment,
  isOpen,
  onClose,
}: AssignmentDetailModalProps) {
  if (!assignment) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#151025] border border-slate-800/60 shadow-xl transition-all">
                {/* Header */}
                <div className="border-b border-slate-800/60 bg-[#1A142B] px-6 py-4 flex items-start justify-between">
                  <div className="flex-1">
                    <Dialog.Title className="text-xl font-bold text-white">
                      {assignment.title}
                    </Dialog.Title>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          assignment.difficulty === "beginner"
                            ? "bg-green-400/10 text-green-400"
                            : assignment.difficulty === "intermediate"
                              ? "bg-yellow-400/10 text-yellow-500"
                              : "bg-rose-400/10 text-rose-400"
                        }`}
                      >
                        {assignment.difficulty.charAt(0).toUpperCase() +
                          assignment.difficulty.slice(1)}
                      </span>
                      {assignment.tags && assignment.tags.length > 0 && (
                        <>
                          {assignment.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="inline-flex rounded-full bg-slate-700/40 px-2.5 py-1 text-xs font-medium text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-700/30 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                  {/* Due Date & Course Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Due Date
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Created By
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {typeof assignment.instructorId === "string"
                          ? assignment.instructorId
                          : assignment.instructorId?.name || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Last Edited By */}
                  {assignment.lastEditedBy &&
                    typeof assignment.lastEditedBy !== "string" &&
                    typeof assignment.instructorId !== "string" &&
                    assignment.instructorId &&
                    assignment.lastEditedBy._id !==
                      assignment.instructorId._id && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                          Last Edited By
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-300">
                          {typeof assignment.lastEditedBy === "string"
                            ? assignment.lastEditedBy
                            : assignment.lastEditedBy?.name || "Unknown"}
                        </p>
                      </div>
                    )}

                  {/* Description */}
                  <div className="border-t border-slate-700/50 pt-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      Description
                    </p>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                        {assignment.description}
                      </p>
                    </div>
                  </div>

                  {/* Edit History Info for Instructors */}
                  {assignment.editHistory &&
                    assignment.editHistory.length > 1 && (
                      <div className="border-t border-slate-700/50 pt-6">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                          Edit History ({assignment.editHistory.length})
                        </p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {[...(assignment.editHistory ?? [])]
                            .reverse()
                            .map((edit, i: number) => (
                              <div
                                key={i}
                                className="text-xs bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/50"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-slate-300">
                                    {edit.note}
                                  </span>
                                  <span className="text-slate-500">
                                    {new Date(
                                      edit.editedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-slate-400 mt-1">
                                  by{" "}
                                  {typeof edit.instructorId === "string"
                                    ? edit.instructorId
                                    : "Unknown"}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-800/60 bg-[#1A142B] px-6 py-4 flex justify-end">
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/60 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
