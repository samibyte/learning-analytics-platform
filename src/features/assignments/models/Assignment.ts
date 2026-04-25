import mongoose, { Schema, Document, models } from "mongoose";

export interface IAssignmentEdit {
  instructorId: mongoose.Types.ObjectId;
  editedAt: Date;
  note?: string;
}

export interface IAssignment extends Document {
  title: string;
  description: string;
  instructorId: mongoose.Types.ObjectId;   // original creator (immutable)
  lastEditedBy?: mongoose.Types.ObjectId;  // last instructor to edit
  editHistory: IAssignmentEdit[];           // full audit trail
  dueDate: Date;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  referenceMaterials?: string[];
}

const AssignmentEditSchema = new Schema<IAssignmentEdit>(
  {
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    editedAt: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: "User" },
    editHistory: { type: [AssignmentEditSchema], default: [] },
    dueDate: { type: Date, required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    tags: [{ type: String }],
    referenceMaterials: [{ type: String }],
  },
  { timestamps: true }
);

export const Assignment =
  models.Assignment || mongoose.model<IAssignment>("Assignment", AssignmentSchema);
