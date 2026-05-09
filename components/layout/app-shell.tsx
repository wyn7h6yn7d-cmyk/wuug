"use client";

import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";
import { MobileNav } from "./mobile-nav";
import { OrbBackground } from "@/components/command-center/orb-background";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toast";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-[#F7FAFF]">
        <OrbBackground />
        <div className="relative p-3 sm:p-4 lg:p-6">
          <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[280px_1fr] lg:gap-6">
            <SidebarNav />
            <div className="min-w-0">
              <MobileNav />
              <TopBar />
              <main className="pb-10">{children}</main>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}
