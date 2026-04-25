import type { Metadata } from "next";
import "../styles/globals.css"
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "EduAnalytics — Learning Analytics Platform",
  description: "Role-based assignment and learning analytics platform for instructors and students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#0F0A1A]">
      <body className="h-full antialiased">
        <Providers>
          {children}
          <Toaster theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
