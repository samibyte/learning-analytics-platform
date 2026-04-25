export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type SubmissionStatus = "pending" | "accepted" | "needs_improvement";

export interface AssignmentEditEntry {
  instructorId: string | { _id: string; name?: string; email?: string };
  editedAt: string;
  note?: string;
}

export interface AssignmentPayload {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  difficulty: DifficultyLevel;
  tags?: string[];
  instructorId?: string | { _id: string; name?: string; email?: string };
  lastEditedBy?: string | { _id: string; name?: string; email?: string };
  editHistory?: AssignmentEditEntry[];
}

export interface SubmissionReviewHistory {
  reviewedBy?: string | { _id: string; name?: string; email?: string };
  reviewedAt: string;
  status: SubmissionStatus;
  feedback: string;
}

export interface SubmissionPayload {
  _id: string;
  assignmentId: string;
  studentId: string | { _id: string; name?: string; email?: string };
  repoUrl: string;
  liveUrl?: string;
  note?: string;
  status: SubmissionStatus;
  feedback?: string;
  reviewedBy?: string | { _id: string; name?: string; email?: string };
  reviewedAt?: string;
  reviewHistory?: SubmissionReviewHistory[];
  aiPreliminaryFeedback?: string;
  isLate?: boolean;
  maxMarks?: number;
  assignment?: AssignmentPayload;
}
