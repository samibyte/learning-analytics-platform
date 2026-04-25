import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Always run dynamically — session is request-scoped
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "instructor") {
    redirect("/instructor/dashboard");
  }

  redirect("/student/dashboard");
}
