"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 rounded-[24px] border border-[#E5EAF3] bg-white/90 p-3 shadow-[0_8px_30px_rgba(66,86,122,0.08)] lg:hidden">
      <div className="mb-3">
        <BrandLogo />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium",
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
