"use server";

import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { Submission } from "./models/Submission";
import { Assignment } from "../assignments/models/Assignment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type {
  AssignmentPayload,
  SubmissionPayload,
  SubmissionStatus,
} from "@/features/types";

export async function getStudentDashboardData(): Promise<{
  assignments: AssignmentPayload[];
  submissions: SubmissionPayload[];
}> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  // Get all assignments
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

  // Get all submissions for this specific student
  const submissions = (await Submission.find({
    studentId: session.user.id,
  }).lean()) as SubmissionPayload[];

  return {
    assignments: JSON.parse(JSON.stringify(assignments)),
    submissions: JSON.parse(JSON.stringify(submissions)),
  };
}

export async function getAssignmentDetails(
  assignmentId: string,
): Promise<AssignmentPayload | null> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student")
    throw new Error("Unauthorized");

  await connectToDatabase();
  const assignment = (await Assignment.findById(assignmentId)
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
    .lean()) as AssignmentPayload | null;
  return assignment ? JSON.parse(JSON.stringify(assignment)) : null;
}

export async function submitAssignment(
  assignmentId: string,
  formData: FormData,
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const repoUrl = formData.get("repoUrl") as string;
  const liveUrl = formData.get("liveUrl") as string;
  const note = formData.get("note") as string;

  if (!repoUrl) {
    throw new Error("Repository URL is required");
  }

  // --- SMART FEATURE: Repo Analyzer ---
  // If the user submits a GitHub URL, we perform a lightweight fetch to check for a package.json
  // to give the instructor preliminary feedback about their tech stack.
  let aiPreliminaryFeedback = "";

  try {
    if (repoUrl.includes("github.com")) {
      // Very simple parser: https://github.com/user/repo => https://raw.githubusercontent.com/user/repo/main/package.json
      const rawUrl =
        repoUrl
          .replace("github.com", "raw.githubusercontent.com")
          .replace(/\/tree\/.*?\//, "/") + "/main/package.json";

      const response = await fetch(rawUrl);
      if (response.ok) {
        const pkg = await response.json();
        const deps = Object.keys(pkg.dependencies || {}).concat(
          Object.keys(pkg.devDependencies || {}),
        );

        const foundTech = [];
        if (deps.includes("next")) foundTech.push("Next.js");
        if (deps.includes("mongoose")) foundTech.push("Mongoose");
        if (
          deps.includes("tailwindcss") ||
          deps.includes("@tailwindcss/postcss")
        )
          foundTech.push("Tailwind CSS");
        if (deps.includes("recharts") || deps.includes("chart.js"))
          foundTech.push("Charting Library");

        if (foundTech.length > 0) {
          aiPreliminaryFeedback = `🤖 AI Analysis: Detected ${foundTech.join(", ")} in package.json.`;
        } else {
          aiPreliminaryFeedback = `🤖 AI Analysis: Minimal dependencies found in package.json.`;
        }
      } else {
        aiPreliminaryFeedback = `🤖 AI Analysis: Could not fetch package.json (might be a private repo or non-standard structure).`;
      }
    }
  } catch (e) {
    // Silently fail the smart feature if network error
    console.error("Repo Analyzer failed:", e);
  }

  // --- LATE SUBMISSION LOGIC ---
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new Error("Assignment not found");

  const isLate = new Date() > new Date(assignment.dueDate);
  const maxMarks = isLate ? 30 : 60;

  // Check if they already submitted to avoid duplicates
  const existingSubmission = await Submission.findOne({
    assignmentId,
    studentId: session.user.id,
  });

  if (existingSubmission) {
    // Update existing
    existingSubmission.repoUrl = repoUrl;
    existingSubmission.liveUrl = liveUrl;
    existingSubmission.note = note;
    existingSubmission.status = "pending";
    existingSubmission.isLate = isLate;
    existingSubmission.maxMarks = maxMarks;
    if (aiPreliminaryFeedback)
      existingSubmission.aiPreliminaryFeedback = aiPreliminaryFeedback;
    await existingSubmission.save();
    return { success: true };
  }

  await Submission.create({
    assignmentId,
    studentId: session.user.id,
    repoUrl,
    liveUrl,
    note,
    aiPreliminaryFeedback,
    isLate,
    maxMarks,
  });

  return { success: true };
}

export async function getAllSubmissionsForInstructor(): Promise<
  SubmissionPayload[]
> {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  // All instructors see ALL assignments in the organisation
  const assignments = (await Assignment.find()
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

  const assignmentMap = assignments.reduce<Record<string, AssignmentPayload>>(
    (acc, a) => {
      acc[a._id] = a;
      return acc;
    },
    {},
  );

  const assignmentIds = Object.keys(assignmentMap);

  const submissions = (await Submission.find({
    assignmentId: { $in: assignmentIds },
  })
    .populate({ path: "studentId", select: "name email" })
    .populate({
      path: "reviewedBy",
      select: "name email",
      options: { strictPopulate: false },
    })
    .populate({
      path: "reviewHistory.reviewedBy",
      select: "name email",
      options: { strictPopulate: false },
    })
    .sort({ createdAt: -1 })
    .lean()) as SubmissionPayload[];

  return submissions.map((s) => ({
    ...JSON.parse(JSON.stringify(s)),
    assignment: JSON.parse(JSON.stringify(assignmentMap[s.assignmentId])),
  }));
}

export async function reviewSubmission(
  submissionId: string,
  status: SubmissionStatus,
  feedback: string,
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "instructor")
    throw new Error("Unauthorized");

  await connectToDatabase();

  const submission = await Submission.findById(submissionId);
  if (!submission) throw new Error("Submission not found");

  // Audit trail
  const reviewerId = new mongoose.Types.ObjectId(session.user.id);
  const newReview = {
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    status,
    feedback,
  };

  submission.status = status;
  submission.feedback = feedback;
  submission.reviewedBy = reviewerId;
  submission.reviewedAt = new Date();

  if (!submission.reviewHistory) submission.reviewHistory = [];
  submission.reviewHistory.push(newReview);

  await submission.save();

  return { success: true };
}
