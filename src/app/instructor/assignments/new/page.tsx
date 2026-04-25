"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/features/assignments/actions";
import { refineAssignmentClarity } from "@/features/assignments/ai-actions";

import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRefineClarity = async () => {
    if (!description.trim()) {
      setError("Please write a draft description first before using AI.");
      return;
    }

    setAiLoading(true);
    setError("");

    const res = await refineAssignmentClarity(description);

    if (res.success) {
      setDescription(res.text || "");
      if (res.isFallback) {
        toast.warning("Gemini API High Traffic", {
          description:
            "We automatically applied a fallback formatting rule because the live AI model is temporarily unavailable.",
        });
      } else {
        toast.success("Description enhanced by AI!", {
          description: "Gemini successfully refined your draft.",
        });
      }
    } else {
      setError(res.error || "Failed to refine clarity.");
    }

    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await createAssignment(formData);
      toast.success("Assignment created!");
      await router.push("/instructor/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create assignment",
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Page header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-800/60 bg-[#0F0A1A]/80 backdrop-blur-md px-8">
        <div>
          <h1 className="text-lg font-semibold text-white">
            Create New Assignment
          </h1>
          <p className="text-xs text-slate-400">
            Fill in the details below to publish a new assignment
          </p>
        </div>
      </header>

      <div className="flex-1  p-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#151025] px-6 py-8 sm:px-10 border border-slate-800/60 rounded-2xl shadow-xl">
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
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                    placeholder="e.g., Build a React Counter App"
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
                    className="flex items-center text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {aiLoading ? "Refining..." : "Enhance Clarity with AI"}
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
                    placeholder="Describe the requirements of the assignment..."
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
                    Due Date
                  </label>
                  <div className="mt-2">
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      required
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
                    className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
                    placeholder="e.g., React, Frontend, Hooks"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
