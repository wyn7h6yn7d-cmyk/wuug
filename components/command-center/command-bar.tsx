"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

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
  /**
   * Marketing / hero: same look, but no input focus, typing, chip clicks, or submit.
   * Use on the public landing page; keep interactive inside the app.
   */
  decorative?: boolean;
};

export function CommandBar({
  placeholder = "Ask Wuug what needs attention today…",
  chips,
  className,
  compact = false,
  onSubmit,
  onChipClick,
  decorative = false,
}: CommandBarProps) {
  const [value, setValue] = React.useState("");

  const shellClass = cn(
    "group relative w-full overflow-hidden rounded-[28px] glass-strong",
    "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
    decorative && "pointer-events-none select-none",
    className,
  );

  const inner = (
    <>
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
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="absolute inset-0 rounded-2xl pulse-ring" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl border border-token-soft bg-surface/70 px-4 py-3 text-sm",
              decorative ? "text-fg-soft" : "text-fg-muted",
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-fg-soft" aria-hidden />
            {decorative ? (
              <p className="w-full text-left text-fg-soft">{placeholder}</p>
            ) : (
              <>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-transparent text-sm text-fg placeholder:text-fg-soft focus:outline-none"
                />
              </>
            )}
          </div>
          {chips && chips.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {decorative
                ? chips.map((chip) => (
                    <span
                      key={chip.key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-token-soft bg-surface/70 px-3 py-1.5 text-xs font-semibold text-fg-muted"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))] opacity-70" aria-hidden />
                      {chip.label}
                    </span>
                  ))
                : chips.map((chip) => (
                    <motion.button
                      key={chip.key}
                      type="button"
                      onClick={() => {
                        if (onChipClick) onChipClick(chip);
                        setValue(chip.label);
                      }}
                      whileHover={btnHoverLift("secondary")}
                      whileTap={BTN_TAP}
                      transition={BTN_SPRING}
                      className="group/chip inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-token-soft bg-surface/70 px-3 py-1.5 text-xs font-semibold text-fg-muted outline-none hover:border-[rgb(var(--accent)/0.4)] hover:text-fg focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))] opacity-70 transition-transform group-hover/chip:scale-125 group-hover/chip:opacity-100" />
                      {chip.label}
                    </motion.button>
                  ))}
            </div>
          ) : null}
        </div>
        {decorative ? (
          <span className="hidden h-11 items-center gap-2 rounded-2xl gradient-sheen px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] sm:inline-flex">
            Run <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        ) : (
          <motion.button
            type="submit"
            whileHover={btnHoverLift("primary")}
            whileTap={BTN_TAP}
            transition={BTN_SPRING}
            className="hidden h-11 cursor-pointer items-center gap-2 rounded-2xl gradient-sheen px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:inline-flex [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5"
          >
            Run <ArrowRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </>
  );

  if (decorative) {
    return (
      <motion.div
        aria-label="Product preview: AI command bar"
        className={shellClass}
        initial={false}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(value);
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={shellClass}
    >
      {inner}
    </motion.form>
  );
}
