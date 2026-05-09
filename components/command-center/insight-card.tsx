"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InsightCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  meta?: string;
  tone?: "neutral" | "warn" | "risk" | "calm" | "accent";
  className?: string;
  /** small floating offset for hero use */
  float?: boolean;
};

const toneToColor: Record<NonNullable<InsightCardProps["tone"]>, string> = {
  neutral: "rgb(var(--fg-soft))",
  warn: "rgb(var(--warn))",
  risk: "rgb(var(--risk))",
  calm: "rgb(var(--healthy))",
  accent: "rgb(var(--accent))",
};

export function InsightCard({
  icon: Icon,
  label,
  value,
  meta,
  tone = "neutral",
  className,
  float = false,
}: InsightCardProps) {
  const color = toneToColor[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={
        float
          ? { opacity: 1, y: [0, -4, 0] }
          : { opacity: 1, y: 0 }
      }
      transition={
        float
          ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.35, ease: "easeOut" }
      }
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-token-soft bg-surface/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur",
        "dark:bg-surface/70 dark:shadow-[0_22px_50px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <span
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-50 blur-2xl"
        style={{ background: color }}
        aria-hidden
      />
      <div className="relative flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
          style={{
            borderColor: "rgb(var(--border))",
            background: "rgb(var(--surface) / 0.85)",
            color,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-soft">{label}</div>
          <div className="mt-0.5 truncate text-base font-semibold text-fg">{value}</div>
          {meta ? <div className="text-xs text-fg-soft">{meta}</div> : null}
        </div>
      </div>
    </motion.div>
  );
}
