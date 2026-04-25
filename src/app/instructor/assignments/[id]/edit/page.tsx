"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  updateAssignment,
  deleteAssignment,
} from "@/features/assignments/actions";
import { refineAssignmentClarity } from "@/features/assignments/ai-actions";
import type { AssignmentPayload, AssignmentEditEntry } from "@/features/types";
import { Sparkles, Clock, User, Trash2 } from "lucide-react";
import { toast } from "sonner";

// We fetch assignment data on the client so the form comes pre-filled
async function fetchAssignment(id: string) {
  const res = await fetch(`/api/assignments/${id}`);
  if (!res.ok) throw new Error("Failed to load assignment");
  return res.json();
}

export default function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [editNote, setEditNote] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [editHistory, setEditHistory] = useState<AssignmentEditEntry[]>([]);
  const [creator, setCreator] = useState<
    AssignmentPayload["instructorId"] | null
  >(null);

  useEffect(() => {
    fetchAssignment(id)
      .then((data) => {
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setDifficulty(data.difficulty ?? "beginner");
        setDueDate(data.dueDate ? data.dueDate.split("T")[0] : "");
        setTags(data.tags?.join(", ") ?? "");
        setEditHistory(data.editHistory ?? []);
        setCreator(data.instructorId);
      })
      .catch(() => setError("Could not load assignment."))
      .finally(() => setFetchLoading(false));
  }, [id]);

  const handleRefineClarity = async () => {
    if (!description.trim()) {
      setError("Please write a description first.");
      return;
    }
    setAiLoading(true);
    setError("");
    const res = await refineAssignmentClarity(description);
    if (res.success) {
      setDescription(res.text || "");
      if (res.isFallback) {
        toast.warning("Fallback formatting applied", {
          description: "Gemini was unavailable; a local rule was used instead.",
        });
      } else {
        toast.success("Description enhanced by AI!");
      }
    } else {
      setError(res.error || "Failed to refine.");
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await updateAssignment(id, fd);
      toast.success("Assignment updated!");
      await router.push("/instructor/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update assignment",
      );
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteAssignment(id);
      toast.success("Assignment deleted!");
      await router.push("/instructor/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete assignment",
      );
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-0">
          <h1 className="text-lg font-semibold text-white">Edit Assignment</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-400 text-sm animate-pulse">
            Loading assignment…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-0">
        <div>
          <h1 className="text-lg font-semibold text-white">Edit Assignment</h1>
          <p className="text-xs text-slate-400">
            Any instructor can edit — changes are tracked
          </p>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl flex flex-col lg:flex-row gap-8 mx-auto">
          {/* ── Edit form ── */}
          <div className="bg-[#151025] lg:flex-3 px-4 sm:px-6 py-8 md:px-10 border border-slate-800/60 rounded-2xl shadow-xl w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/30 text-rose-400 p-3 rounded-md text-sm border border-red-800/50">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-slate-300"
                >
                  Assignment Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleRefineClarity}
                    disabled={aiLoading}
                    className="flex items-center text-xs sm:text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {aiLoading ? "Refining…" : "Enhance with AI"}
                  </button>
                </div>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={10}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Difficulty Level
                  </label>
                  <div className="mt-2">
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all appearance-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Deadline
                  </label>
                  <div className="mt-2">
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-slate-400 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-slate-300"
                >
                  Tags (comma separated)
                </label>
                <div className="mt-2">
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                    placeholder="e.g., React, Frontend, Hooks"
                  />
                </div>
              </div>

              {/* Edit note */}
              <div>
                <label
                  htmlFor="editNote"
                  className="block text-sm font-medium text-slate-300"
                >
                  Edit Note{" "}
                  <span className="text-slate-500 font-normal">
                    (optional — why are you changing this?)
                  </span>
                </label>
                <div className="mt-2">
                  <input
                    id="editNote"
                    name="editNote"
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="e.g., Extended Deadline by one week"
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50 order-1 sm:order-none"
                >
                  {loading ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading || deleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600/20 border border-rose-600/30 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-600/30 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50 order-2 sm:order-none"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </form>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-[#151025] border border-slate-800/60 shadow-xl p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delete Assignment?
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    This action cannot be undone. All related submissions will
                    also be permanently deleted.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-700/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/40 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Edit history / audit trail ── */}
          {editHistory.length > 0 && (
            <div className="lg:flex-1 rounded-2xl bg-[#151025] border border-slate-800/60 overflow-hidden w-full h-fit">
              <div className="border-b border-slate-800/60 px-6 py-4">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Edit History
                </h2>
              </div>
              <ul className="divide-y divide-slate-800/60">
                {[...editHistory].reverse().map((entry, i: number) => (
                  <li key={i} className="px-6 py-3 flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 mt-0.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium">
                        {typeof entry.instructorId === "string"
                          ? entry.instructorId
                          : (entry.instructorId?.name ??
                            entry.instructorId?._id ??
                            "Unknown")}
                        {entry.note && (
                          <span className="ml-2 font-normal text-slate-400">
                            — {entry.note}
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(entry.editedAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
