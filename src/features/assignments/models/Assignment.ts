import mongoose, { Schema, Document, models } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  instructorId: mongoose.Types.ObjectId;
  dueDate: Date;
  difficulty: "beginner" | "intermediate" | "advanced"; // Required by assessment
  tags?: string[]; // Bonus: To categorize assignments
  referenceMaterials?: string[]; // Bonus: Helpful links for students
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    tags: [{ type: String }],
    referenceMaterials: [{ type: String }],
  },
  { timestamps: true }
);

export const Assignment = models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
