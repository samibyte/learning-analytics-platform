import mongoose, { Schema, Document, models } from "mongoose";

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  repoUrl: string;
  note: string;
  status: "pending" | "accepted" | "needs_improvement"; // Updated based on requirements
  feedback?: string;
  aiPreliminaryFeedback?: string; // Bonus feature: To hold AI-generated feedback
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    repoUrl: { type: String, required: true },
    note: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "needs_improvement"], 
      default: "pending" 
    },
    feedback: { type: String },
    aiPreliminaryFeedback: { type: String },
  },
  { timestamps: true }
);

export const Submission = models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
