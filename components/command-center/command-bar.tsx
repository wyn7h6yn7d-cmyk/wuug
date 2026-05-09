"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type CommandBarChip = {
  key: string;
  label: string;
};

type CommandBarProps = {
  placeholder?: string;
  chips?: CommandBarChip[];
  className?: string;
  compact?: boolean;
};

export function CommandBar({
  placeholder = "Küsi wuugilt või otsi…",
  chips,
  className,
  compact = false,
}: CommandBarProps) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative w-full overflow-hidden rounded-[26px] border border-white/60 bg-white/55 shadow-[0_22px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl",
        "ring-1 ring-slate-900/[0.04]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_0%,rgba(99,102,241,0.14),transparent_58%),radial-gradient(900px_420px_at_115%_0%,rgba(20,184,166,0.12),transparent_52%)] opacity-90" />

      <div className={cn("relative flex items-center gap-3 p-4", compact && "p-3")}>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-slate-700 shadow-sm ring-1 ring-slate-900/[0.04]">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03]">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          {chips && chips.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/[0.03] hover:bg-white/75"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-900/[0.03]">
            ⌘K
          </span>
        </div>
      </div>
    </motion.div>
  );
}

