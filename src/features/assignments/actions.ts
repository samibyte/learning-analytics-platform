"use server";

import connectToDatabase from "@/lib/db";
import { Assignment } from "./models/Assignment";
import { Submission, ISubmission } from "../submissions/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getInstructorDashboardData() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "instructor") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const assignments = await Assignment.find({ instructorId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  // Also get the number of pending submissions for this instructor
  const assignmentIds = assignments.map(a => a._id);
  const pendingSubmissionsCount = await Submission.countDocuments({
    assignmentId: { $in: assignmentIds },
    status: "pending",
  });

  return {
    assignments: JSON.parse(JSON.stringify(assignments)),
    pendingSubmissionsCount,
  };
}

export async function createAssignment(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "instructor") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const dueDateStr = formData.get("dueDate") as string;
  const tagsStr = formData.get("tags") as string;

  if (!title || !description || !difficulty || !dueDateStr) {
    throw new Error("Missing required fields");
  }

  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()) : [];

  const assignment = await Assignment.create({
    title,
    description,
    difficulty,
    dueDate: new Date(dueDateStr),
    instructorId: session.user.id,
    tags,
  });

  return { success: true, assignmentId: assignment._id.toString() };
}

