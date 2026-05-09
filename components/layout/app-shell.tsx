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
      <div className="relative min-h-screen bg-app">
        <OrbBackground />
        <div className="relative px-3 pb-12 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pt-6">
          <div className="mx-auto grid w-full max-w-[1680px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
            <SidebarNav />
            <div className="min-w-0">
              <MobileNav />
              <TopBar />
              <main>{children}</main>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </AuthProvider>
  );
}
