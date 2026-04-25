"use server";

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Assignment } from "./models/Assignment";
import { Submission } from "../submissions/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { AssignmentPayload, DifficultyLevel } from "@/features/types";

/** ─── INSTRUCTOR DASHBOARD ──────────────────────────────────────────────── **/
export async function getInstructorDashboardData(): Promise<{
  assignments: AssignmentPayload[];
  pendingSubmissionsCount: number;
  totalSubmissions: number;
  acceptedCount: number;
  totalStudents: number;
}> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  // All instructors see ALL assignments in the organisation
  const assignments = (await Assignment.find()
    .sort({ createdAt: -1 })
    .populate({
      path: "instructorId",
      select: "name email",
      options: { strictPopulate: false },
    })
    .populate({
      path: "lastEditedBy",
      select: "name email",
      options: { strictPopulate: false },
    })
    .populate({
      path: "editHistory.instructorId",
      select: "name email",
      options: { strictPopulate: false },
    })
    .lean()) as AssignmentPayload[];

  const assignmentIds = assignments.map((a) => a._id);

  const [
    pendingSubmissionsCount,
    totalSubmissions,
    acceptedCount,
    totalStudents,
  ] = await Promise.all([
    Submission.countDocuments({
      assignmentId: { $in: assignmentIds },
      status: "pending",
    }),
    Submission.countDocuments({ assignmentId: { $in: assignmentIds } }),
    Submission.countDocuments({
      assignmentId: { $in: assignmentIds },
      status: "accepted",
    }),
    Submission.distinct("studentId", {
      assignmentId: { $in: assignmentIds },
    }).then((ids) => ids.length),
  ]);

  return {
    assignments: JSON.parse(JSON.stringify(assignments)),
    pendingSubmissionsCount,
    totalSubmissions,
    acceptedCount,
    totalStudents,
  };
}

/** ─── CREATE ASSIGNMENT ─────────────────────────────────────────────────── **/
export async function createAssignment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as DifficultyLevel;
  const dueDateStr = formData.get("dueDate") as string;
  const tagsStr = formData.get("tags") as string;

  if (!title || !description || !difficulty || !dueDateStr) {
    throw new Error("Missing required fields");
  }

  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];

  const assignment = await Assignment.create({
    title,
    description,
    difficulty,
    dueDate: new Date(dueDateStr),
    instructorId: new mongoose.Types.ObjectId(session.user.id),
    lastEditedBy: new mongoose.Types.ObjectId(session.user.id),
    // Seed the edit history with the creation event
    editHistory: [
      {
        instructorId: new mongoose.Types.ObjectId(session.user.id),
        editedAt: new Date(),
        note: "Created",
      },
    ],
    tags,
  });

  return { success: true, assignmentId: assignment._id.toString() };
}

/** ─── UPDATE ASSIGNMENT (any instructor can edit) ───────────────────────── **/
export async function updateAssignment(
  assignmentId: string,
  formData: FormData,
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const dueDateStr = formData.get("dueDate") as string;
  const tagsStr = formData.get("tags") as string;
  const editNote = (formData.get("editNote") as string) || "Edited";

  if (title) assignment.title = title;
  if (description) assignment.description = description;
  if (difficulty)
    assignment.difficulty = difficulty as
      | "beginner"
      | "intermediate"
      | "advanced";
  if (dueDateStr) assignment.dueDate = new Date(dueDateStr);
  if (tagsStr !== null)
    assignment.tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

  // Audit trail
  assignment.lastEditedBy = new mongoose.Types.ObjectId(session.user.id);
  assignment.editHistory.push({
    instructorId: new mongoose.Types.ObjectId(session.user.id),
    editedAt: new Date(),
    note: editNote,
  });

  await assignment.save();
  return { success: true };
}

/** ─── DELETE ASSIGNMENT (only instructors) ─────────────────────────────── **/
export async function deleteAssignment(assignmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");

  // Delete all submissions related to this assignment
  await Submission.deleteMany({ assignmentId });

  // Delete the assignment
  await Assignment.findByIdAndDelete(assignmentId);

  return { success: true };
}
