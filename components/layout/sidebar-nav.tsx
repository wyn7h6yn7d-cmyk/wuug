"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-full rounded-[28px] border border-[#E5EAF3] bg-white/90 p-5 shadow-[0_8px_30px_rgba(66,86,122,0.08)] lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:w-64">
      <div className="mb-8">
        <BrandLogo />
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        wuug näitab, mis vajab järgmist sammu - enne kui midagi ununeb.
      </div>
    </aside>
  );
}
