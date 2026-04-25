"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { SubmissionStatus } from "@/features/types";

interface SubmissionReviewFormProps {
  submissionId: string;
  initialStatus: SubmissionStatus;
  initialFeedback?: string;
  submitReview: (formData: FormData) => Promise<unknown>;
}

export function SubmissionReviewForm({
  submissionId,
  initialStatus,
  initialFeedback,
  submitReview,
}: SubmissionReviewFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("submissionId", submissionId);
      formData.set("status", status);
      formData.set("feedback", feedback);

      await submitReview(formData);
      toast.success("Feedback saved!");
      startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save submission feedback",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      {error ? (
        <div className="rounded-md border border-rose-500/30 bg-rose-900/25 p-2 text-[10px] text-rose-200">
          {error}
        </div>
      ) : null}
      <input type="hidden" name="submissionId" value={submissionId} />
      <div className="flex gap-2">
        <select
          name="status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as SubmissionReviewFormProps["initialStatus"],
            )
          }
          className="block w-full rounded-lg border border-slate-700 bg-[#1A142B] px-2 py-1 text-xs text-white focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
          required
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accept</option>
          <option value="needs_improvement">Needs Improvement</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-fuchsia-600 px-3 text-[10px] font-semibold text-white hover:bg-fuchsia-500 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {loading ? "Saving..." : status === "pending" ? "Submit" : "Update"}
        </button>
      </div>
      <textarea
        name="feedback"
        rows={1}
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        placeholder="Feedback..."
        className="block w-full rounded-lg border border-slate-700 bg-[#1A142B] px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 transition-all"
      />
    </form>
  );
}
