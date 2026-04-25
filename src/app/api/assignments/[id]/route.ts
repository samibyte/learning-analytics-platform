import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Assignment } from "@/features/assignments/models/Assignment";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "instructor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const assignment = await Assignment.findById(id)
    .populate({ path: "instructorId", select: "name email", options: { strictPopulate: false } })
    .populate({ path: "lastEditedBy", select: "name email", options: { strictPopulate: false } })
    .populate({ path: "editHistory.instructorId", select: "name email", options: { strictPopulate: false } })
    .lean();


  if (!assignment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(JSON.parse(JSON.stringify(assignment)));
}
