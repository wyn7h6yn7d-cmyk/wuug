"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PulseBadgeProps = {
  label: string;
  tone?: "calm" | "warn" | "risk" | "neutral";
  className?: string;
};

const toneStyles: Record<NonNullable<PulseBadgeProps["tone"]>, string> = {
  calm: "border-emerald-200/70 bg-emerald-50/70 text-emerald-800",
  warn: "border-amber-200/70 bg-amber-50/70 text-amber-900",
  risk: "border-rose-200/70 bg-rose-50/70 text-rose-900",
  neutral: "border-slate-200/70 bg-white/55 text-slate-700",
};

const dotStyles: Record<NonNullable<PulseBadgeProps["tone"]>, string> = {
  calm: "bg-emerald-500",
  warn: "bg-amber-500",
  risk: "bg-rose-500",
  neutral: "bg-slate-500",
};

export function PulseBadge({ label, tone = "neutral", className }: PulseBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-slate-900/[0.03]",
        toneStyles[tone],
        className,
      )}
    >
      <span className={cn("relative flex h-2 w-2", dotStyles[tone])}>
        <motion.span
          className={cn("absolute inset-0 rounded-full", dotStyles[tone])}
          initial={{ opacity: 0.25, scale: 1 }}
          animate={{ opacity: [0.12, 0.22, 0.12], scale: [1, 1.9, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative block h-2 w-2 rounded-full bg-current" />
      </span>
      {label}
    </span>
  );
}

