"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SidebarProvider } from "./SidebarProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}
