"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandBarChip = {
  key: string;
  label: string;
};

type CommandBarProps = {
  placeholder?: string;
  chips?: CommandBarChip[];
  className?: string;
  compact?: boolean;
  onSubmit?: (value: string) => void;
  onChipClick?: (chip: CommandBarChip) => void;
};

export function CommandBar({
  placeholder = "Ask wuug what needs attention today…",
  chips,
  className,
  compact = false,
  onSubmit,
  onChipClick,
}: CommandBarProps) {
  const [value, setValue] = React.useState("");

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(value);
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative w-full overflow-hidden rounded-[28px] glass-strong",
        "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px 420px at 15% 0%, rgb(var(--accent) / 0.18), transparent 58%)," +
            "radial-gradient(900px 420px at 115% 0%, rgb(var(--accent-3) / 0.16), transparent 52%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgb(var(--accent)), rgb(var(--accent-2)), rgb(var(--accent-3)), transparent)",
        }}
      />

      <div className={cn("relative flex items-center gap-3 p-3 sm:p-4", compact && "p-2.5")}>
        <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-token-soft bg-surface/80 text-[rgb(var(--accent))] shadow-sm">
          <Sparkles className="h-5 w-5" />
          <span className="absolute inset-0 rounded-2xl pulse-ring" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 text-sm text-fg-muted">
            <Search className="h-4 w-4 text-fg-soft" />
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-sm text-fg placeholder:text-fg-soft focus:outline-none"
            />
            <span className="hidden rounded-md border border-token-soft bg-bg2/80 px-1.5 py-0.5 text-[10px] font-semibold text-fg-soft md:inline">
              ⌘K
            </span>
          </div>
          {chips && chips.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => {
                    if (onChipClick) onChipClick(chip);
                    setValue(chip.label);
                  }}
                  className="group/chip inline-flex items-center gap-1.5 rounded-full border border-token-soft bg-surface/70 px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-[rgb(var(--accent)/0.4)] hover:text-fg"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))] opacity-70 group-hover/chip:opacity-100" />
                  {chip.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className="hidden h-11 items-center gap-2 rounded-2xl gradient-sheen px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] sm:inline-flex"
        >
          Run <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.form>
  );
}
