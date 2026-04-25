import mongoose, { Schema, Document, models } from "mongoose";

export interface IReviewHistory {
  reviewedBy: mongoose.Types.ObjectId;
  reviewedAt: Date;
  status: "pending" | "accepted" | "needs_improvement";
  feedback: string;
}

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  repoUrl: string;
  note: string;
  status: "pending" | "accepted" | "needs_improvement";
  feedback?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewHistory: IReviewHistory[];
  aiPreliminaryFeedback?: string;
  isLate: boolean;
  maxMarks: number;
}

const ReviewHistorySchema = new Schema<IReviewHistory>(
  {
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "accepted", "needs_improvement"], required: true },
    feedback: { type: String, required: true },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    repoUrl: { type: String, required: true },
    note: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "needs_improvement"],
      default: "pending",
    },
    feedback: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewHistory: { type: [ReviewHistorySchema], default: [] },
    aiPreliminaryFeedback: { type: String },
    isLate: { type: Boolean, default: false },
    maxMarks: { type: Number, default: 60 },
  },
  { timestamps: true }
);

export const Submission =
  models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
