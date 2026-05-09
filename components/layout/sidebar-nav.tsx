"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { getNavigationForRole } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
              className={cn(
                "group relative flex items-center gap-3 rounded-[20px] px-3 py-2.5 text-sm font-semibold transition",
                isActive ? "text-fg" : "text-fg-soft hover:text-fg",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-[20px] border border-token-soft bg-[rgb(var(--accent)/0.08)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] dark:bg-[rgb(var(--accent)/0.18)]"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              ) : null}
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

      <div className="mt-4 flex items-center justify-between gap-2 rounded-[20px] border border-token-soft bg-surface/60 px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-soft">Theme</span>
        <ThemeToggle size="sm" />
      </div>
    </aside>
  );
}
