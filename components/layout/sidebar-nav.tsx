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
    <aside
      className={cn(
        "hidden w-full flex-col rounded-[32px] glass-strong p-5",
        "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
        "lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)]",
      )}
    >
      <div className="mb-7 flex items-center justify-between">
        <BrandLogo />
      </div>

      <nav className="flex-1 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "group relative flex items-center gap-3 rounded-[20px] px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
                isActive
                  ? "border border-token-soft bg-[rgb(var(--accent)/0.08)] text-fg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] dark:bg-[rgb(var(--accent)/0.18)]"
                  : "border border-transparent text-fg-soft hover:text-fg",
              )}
            >
              <span
                className={cn(
                  "relative inline-flex h-9 w-9 items-center justify-center rounded-2xl border",
                  isActive
                    ? "border-[rgb(var(--accent)/0.30)] bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--accent))]"
                    : "border-token-soft bg-surface/70 text-fg-muted group-hover:text-fg",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="relative">{item.label}</span>
              {isActive ? (
                <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
