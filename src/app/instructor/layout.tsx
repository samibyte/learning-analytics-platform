import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "instructor") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0F0A1A]">
      <AppSidebar
        role="instructor"
        userName={session.user.name ?? "Instructor"}
        userEmail={session.user.email ?? ""}
      />
      
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        <MobileHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
