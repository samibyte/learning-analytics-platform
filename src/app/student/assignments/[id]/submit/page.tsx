"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  getAssignmentDetails,
  submitAssignment,
} from "@/features/submissions/actions";
import type { AssignmentPayload } from "@/features/types";
import Link from "next/link";

export default function SubmitAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<AssignmentPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAssignmentDetails(assignmentId);
        setAssignment(data);
      } catch (err: unknown) {
        setError("Failed to load assignment details");
      } finally {
        setFetching(false);
      }
    }
    if (assignmentId) load();
  }, [assignmentId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      await submitAssignment(assignmentId, formData);
      toast.success("Assignment submitted!");
      await router.push("/student/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to submit assignment",
      );
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center py-20 text-slate-400">
        Loading assignment details...
      </div>
    );
  if (!assignment)
    return (
      <div className="flex justify-center py-20 text-rose-400">
        Assignment not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/student/dashboard"
          className="text-sm font-medium text-fuchsia-500 hover:text-fuchsia-400"
        >
          &larr; Back to Dashboard
        </Link>
        <h2 className="mt-4 text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Submit Assignment
        </h2>
      </div>

      <div className="bg-[#151025] rounded-2xl shadow border border-slate-800/60 overflow-hidden mb-8">
        <div className="border-b border-slate-800/60 bg-[#1A142B] px-4 py-5 sm:px-6">
          <h3 className="text-lg font-semibold leading-6 text-white">
            {assignment.title}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-400">
            <span>
              Deadline: {new Date(assignment.dueDate).toLocaleDateString()}
            </span>
            <span>&bull;</span>
            <span className="capitalize text-fuchsia-400">
              {assignment.difficulty}
            </span>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6 text-slate-300">
          <p className="whitespace-pre-wrap">{assignment.description}</p>
        </div>
      </div>

      <div className="bg-[#151025] px-6 py-8 sm:px-10 border border-slate-800/60 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 text-rose-400 p-3 rounded-md text-sm border border-red-800/50">
              {error}
            </div>
          )}

          {assignment && new Date() > new Date(assignment.dueDate) && (
            <div className="bg-amber-900/20 text-amber-400 p-4 rounded-xl text-sm border border-amber-800/40 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">
                  Late Submission Warning
                </p>
                <p className="mt-1">
                  The deadline for this assignment has passed. This submission
                  will be capped at{" "}
                  <span className="font-bold text-white">30 marks</span> (out of
                  60).
                </p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="repoUrl"
              className="block text-sm font-medium text-slate-300"
            >
              GitHub Repository URL
            </label>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Our AI Repo Analyzer will automatically scan your package.json!
            </p>
            <input
              id="repoUrl"
              name="repoUrl"
              type="url"
              required
              className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
              placeholder="https://github.com/yourusername/yourrepo"
            />
          </div>

          <div>
            <label
              htmlFor="liveUrl"
              className="block text-sm font-medium text-slate-300"
            >
              Live Project URL
            </label>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Provide a link to your deployed application (e.g., Vercel,
              Netlify).
            </p>
            <input
              id="liveUrl"
              name="liveUrl"
              type="url"
              className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
              placeholder="https://your-project.vercel.app"
            />
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-slate-300"
            >
              Submission Note
            </label>
            <p className="text-xs text-slate-500 mt-1 mb-2">
              Share your experience, struggles, or what you learned.
            </p>
            <textarea
              id="note"
              name="note"
              rows={4}
              className="block w-full rounded-xl border border-transparent bg-[#1A142B] px-4 py-3 text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 sm:text-sm transition-all"
              placeholder="I struggled a bit with the useEffect hook, but the styling was fun!"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-[#151025] transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
