"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PulseBadgeProps = {
  label: string;
  tone?: "calm" | "warn" | "risk" | "neutral" | "accent";
  className?: string;
};

const toneStyles: Record<NonNullable<PulseBadgeProps["tone"]>, string> = {
  calm: "border-[rgb(var(--healthy)/0.35)] bg-[rgb(var(--healthy)/0.08)] text-[rgb(var(--healthy))]",
  warn: "border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.08)] text-[rgb(var(--warn))]",
  risk: "border-[rgb(var(--risk)/0.35)] bg-[rgb(var(--risk)/0.08)] text-[rgb(var(--risk))]",
  neutral:
    "border-token-soft bg-surface/70 text-fg-muted",
  accent:
    "border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.10)] text-[rgb(var(--accent))]",
};

const dotStyles: Record<NonNullable<PulseBadgeProps["tone"]>, string> = {
  calm: "bg-[rgb(var(--healthy))]",
  warn: "bg-[rgb(var(--warn))]",
  risk: "bg-[rgb(var(--risk))]",
  neutral: "bg-fg-soft",
  accent: "bg-[rgb(var(--accent))]",
};

export function PulseBadge({ label, tone = "neutral", className }: PulseBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur",
        toneStyles[tone],
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <motion.span
          className={cn("absolute inset-0 rounded-full opacity-30", dotStyles[tone])}
          initial={{ opacity: 0.25, scale: 1 }}
          animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 2.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className={cn("relative block h-2 w-2 rounded-full", dotStyles[tone])} />
      </span>
      {label}
    </span>
  );
}
