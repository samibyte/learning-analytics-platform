import type { Metadata } from "next";
import "../styles/globals.css"
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Learning Analytics Platform",
  description: "Assignment and Learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
