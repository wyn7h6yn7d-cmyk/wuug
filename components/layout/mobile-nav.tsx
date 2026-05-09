"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { getNavigationForRole } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useAuth();
  const navigationItems = getNavigationForRole(role ?? "member");

  return (
    <div className="mb-4 rounded-[24px] border border-white/60 bg-white/55 p-3 shadow-[0_12px_34px_rgba(66,86,122,0.10)] backdrop-blur lg:hidden">
      <div className="mb-3">
        <BrandLogo />
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold",
                isActive
                  ? "bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 text-white"
                  : "bg-slate-50 text-slate-600",
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
