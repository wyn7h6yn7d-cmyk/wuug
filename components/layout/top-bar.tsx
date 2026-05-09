"use client";

import Link from "next/link";
import * as React from "react";
import { Bell, ChevronDown, LogOut, Search, Settings as SettingsIcon } from "lucide-react";
import { CreateItemFlow } from "@/components/actions/create-item-flow";
import { useAuth } from "@/components/providers/auth-provider";

export function TopBar() {
  const { profile, user, isLoading, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const accountRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!accountRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  const displayName = profile?.full_name?.trim() || user?.email?.trim() || "";

  const initials =
    displayName.length > 0
      ? displayName
          .split(/[\s@]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("") || "U"
      : "U";

  return (
    <header className="mb-6 flex flex-col gap-4 rounded-[24px] border border-[#E5EAF3] bg-white/90 p-4 shadow-[0_8px_30px_rgba(66,86,122,0.08)] md:flex-row md:items-center md:justify-between">
      <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:max-w-xl">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search clients, projects, or tasks…"
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </label>

      <div className="flex items-center gap-2 sm:gap-3">
        <CreateItemFlow />
        <button
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98]"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="h-5 w-5" />
        </button>

        <Link
          href="/settings"
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98] sm:hidden"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:border-slate-300 hover:text-slate-900 active:scale-[0.98] sm:hidden"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div ref={accountRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm hover:bg-slate-50"
            aria-label="Account menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-violet-100 to-teal-100 text-sm font-semibold text-slate-700">
              {initials}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {isLoading ? "Loading…" : displayName || "My account"}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {open ? (
            <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(66,86,122,0.12)]">
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                  {displayName || "Account"}
                </div>
                <div className="text-xs text-slate-500">{profile?.email ?? user?.email ?? ""}</div>
              </div>
              <div className="h-px bg-slate-100" />
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await signOut();
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
