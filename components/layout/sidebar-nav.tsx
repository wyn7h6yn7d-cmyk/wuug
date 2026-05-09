"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { getNavigationForRole } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export function SidebarNav() {
  const pathname = usePathname();
  const { role } = useAuth();
  const navigationItems = getNavigationForRole(role ?? "member");

  return (
    <aside className="hidden w-full rounded-[32px] border border-white/60 bg-white/45 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl ring-1 ring-slate-900/[0.04] lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
      <div className="mb-8">
        <BrandLogo />
      </div>

      <nav className="space-y-1.5">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold transition",
                isActive ? "text-slate-900" : "text-slate-600 hover:bg-white/55 hover:text-slate-900",
              )}
            >
              {isActive ? (
                <span className="absolute inset-0 rounded-[22px] bg-[linear-gradient(90deg,rgba(99,102,241,0.16)_0%,rgba(168,85,247,0.12)_48%,rgba(20,184,166,0.12)_100%)] shadow-[0_18px_44px_rgba(99,102,241,0.12)] ring-1 ring-white/70" />
              ) : null}
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/55 bg-white/55 text-slate-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
