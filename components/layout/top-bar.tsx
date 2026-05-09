"use client";

import Link from "next/link";
import * as React from "react";
import { Bell, ChevronDown, LogOut, Search, Settings as SettingsIcon } from "lucide-react";
import { CreateItemFlow } from "@/components/actions/create-item-flow";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
    <header className="mb-6 flex flex-col gap-4 rounded-[24px] glass p-3 md:flex-row md:items-center md:justify-between">
      <label className="flex w-full items-center gap-3 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 md:max-w-xl">
        <Search className="h-4 w-4 text-fg-soft" />
        <input
          type="text"
          placeholder="Ask Wuug or search…"
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-soft focus:outline-none"
        />
      </label>

      <div className="flex items-center gap-2 sm:gap-3">
        <CreateItemFlow />
        <button
          className="hidden items-center justify-center rounded-2xl border border-token-soft bg-surface/70 p-3 text-fg-muted hover:text-fg active:scale-[0.98] sm:inline-flex"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="h-5 w-5" />
        </button>

        <ThemeToggle className="inline-flex" size="sm" />

        <Link
          href="/settings"
          className="rounded-2xl border border-token-soft bg-surface/70 p-3 text-fg-muted hover:text-fg active:scale-[0.98] sm:hidden"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>

        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-2xl border border-token-soft bg-surface/70 p-3 text-fg-muted hover:text-fg active:scale-[0.98] sm:hidden"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div ref={accountRef} className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-3 rounded-2xl border border-token-soft bg-surface/70 px-2.5 py-2 hover:bg-surface"
            aria-label="Account menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl gradient-sheen text-xs font-bold text-white">
              {initials}
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-fg lg:inline">
              {isLoading ? "Loading…" : displayName || "My account"}
            </span>
            <ChevronDown className="h-4 w-4 text-fg-soft" />
          </button>

          {open ? (
            <div className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-token-soft bg-surface/95 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur dark:bg-surface/90 dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
              <div className="px-4 py-3">
                <div className="text-sm font-semibold text-fg">{displayName || "Account"}</div>
                <div className="text-xs text-fg-soft">{profile?.email ?? user?.email ?? ""}</div>
              </div>
              <div className="h-px bg-token-soft/70" />
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-fg-muted hover:bg-bg2"
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
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-fg-muted hover:bg-bg2"
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
