"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { getNavigationForRole } from "@/lib/navigation";
import { canAccessAdminPanel } from "@/lib/master-admin";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { role, platformAdmin, user } = useAuth();
  const navigationItems = getNavigationForRole(role ?? "member", {
    platformAdmin: canAccessAdminPanel(platformAdmin, user?.email),
  });

  return (
    <div className="mb-4 rounded-[24px] glass p-3 lg:hidden">
      <div className="mb-3 flex items-center gap-3">
        <BrandLogo />
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition",
                isActive
                  ? "gradient-sheen text-white shadow-[0_10px_28px_rgba(99,102,241,0.35)]"
                  : "border border-token-soft bg-surface/60 text-fg-muted",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
