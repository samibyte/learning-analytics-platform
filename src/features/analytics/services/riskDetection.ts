import { User } from "@/features/users/models/User";
import { Assignment } from "@/features/assignments/models/Assignment";
import { Submission, ISubmission } from "@/features/submissions/models/Submission";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export type RiskSeverity = "none" | "low" | "medium" | "high";

export interface StudentRiskProfile {
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalSubmissions: number;
  needsImprovementCount: number;
  lateSubmissionsCount: number;
  missingSubmissionsCount: number;
  riskScore: number;
  severity: RiskSeverity;
  reasons: string[];
}

export async function getAtRiskStudents(): Promise<StudentRiskProfile[]> {
  await connectDB();

  // 1. Get all students
  const students = await User.find({ role: "student" }).lean();
  
  if (!students || students.length === 0) return [];

  // 2. Determine how many assignments are currently past due
  const now = new Date();
  const pastDueAssignmentsCount = await Assignment.countDocuments({
    dueDate: { $lt: now },
  });

  // 3. Aggregate submissions for all students
  // We want to count total submissions, late submissions, and needs_improvement status per student.
  const submissionAggregates = await Submission.aggregate([
    {
      $group: {
         _id: "$studentId",
         totalSubmissions: { $sum: 1 },
         lateCount: {
           $sum: { $cond: [{ $eq: ["$isLate", true] }, 1, 0] }
         },
         needsImprovementCount: {
           $sum: { $cond: [{ $eq: ["$status", "needs_improvement"] }, 1, 0] }
         }
      }
    }
  ]);

  // Convert aggregates to a fast lookup map
  const statsMap = new Map<string, any>();
  for (const stat of submissionAggregates) {
    statsMap.set(stat._id.toString(), stat);
  }

  // 4. Calculate Risk Score for each student
  const profiles: StudentRiskProfile[] = students.map((student) => {
    const stats = statsMap.get(student._id.toString()) || {
      totalSubmissions: 0,
      lateCount: 0,
      needsImprovementCount: 0,
    };

    // Calculate missing submissions. 
    // This is an approximation: (pastDueAssignments - totalSubmissions)
    // We floor it at 0 just in case they've sumitted future assignments early.
    const missingSubmissionsCount = Math.max(0, pastDueAssignmentsCount - stats.totalSubmissions);

    let riskScore = 0;
    const reasons: string[] = [];

    if (stats.needsImprovementCount > 0) {
      riskScore += stats.needsImprovementCount * 2;
      reasons.push(`${stats.needsImprovementCount} Needs Improvement`);
    }

    if (stats.lateCount > 0) {
      riskScore += stats.lateCount * 1;
      reasons.push(`${stats.lateCount} Late Submission(s)`);
    }

    if (missingSubmissionsCount > 0) {
      riskScore += missingSubmissionsCount * 3;
      reasons.push(`${missingSubmissionsCount} Missing Submission(s)`);
    }

    let severity: RiskSeverity = "none";
    if (riskScore >= 6) severity = "high";
    else if (riskScore >= 3) severity = "medium";
    else if (riskScore >= 1) severity = "low";

    return {
      studentId: student._id.toString(),
      studentName: student.name,
      studentEmail: student.email,
      totalSubmissions: stats.totalSubmissions,
      needsImprovementCount: stats.needsImprovementCount,
      lateSubmissionsCount: stats.lateCount,
      missingSubmissionsCount,
      riskScore,
      severity,
      reasons,
    };
  });

  // Filter out students with "none" severity to only return "At-Risk" or optionally return all.
  // We'll return all and let frontend decide, but sort by riskScore descending
  return profiles.sort((a, b) => b.riskScore - a.riskScore);
}
