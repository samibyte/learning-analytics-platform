"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAtRiskStudents, StudentRiskProfile } from "./services/riskDetection";

export async function fetchAtRiskStudentsAction(): Promise<StudentRiskProfile[]> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "instructor") {
    throw new Error("Unauthorized. Only instructors can access risk analytics.");
  }

  try {
    const profiles = await getAtRiskStudents();
    // Only return students that have some level of risk
    return profiles.filter((p) => p.severity !== "none");
  } catch (error) {
    console.error("Failed to fetch at-risk students:", error);
    throw new Error("Could not retrieve at-risk student data.");
  }
}
