"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Handshake,
  ListTodo,
  PauseCircle,
  ShieldAlert,
  Sparkles,
  Timer,
  UserRound,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GLYPHS = {
  "alert-triangle": AlertTriangle,
  clock: Clock,
  handshake: Handshake,
  "list-todo": ListTodo,
  "pause-circle": PauseCircle,
  "shield-alert": ShieldAlert,
  sparkles: Sparkles,
  timer: Timer,
  "user-round": UserRound,
  users: Users,
  zap: Zap,
} as const satisfies Record<string, LucideIcon>;

export type InsightCardGlyph = keyof typeof GLYPHS;

type InsightCardProps = {
  /** Serializable icon id — do not pass Lucide components from Server Components. */
  icon: InsightCardGlyph;
  label: string;
  value: string | number;
  meta?: string;
  tone?: "neutral" | "warn" | "risk" | "calm" | "accent";
  className?: string;
};

const toneToColor: Record<NonNullable<InsightCardProps["tone"]>, string> = {
  neutral: "rgb(var(--fg-soft))",
  warn: "rgb(var(--warn))",
  risk: "rgb(var(--risk))",
  calm: "rgb(var(--healthy))",
  accent: "rgb(var(--accent))",
};

export function InsightCard({
  icon,
  label,
  value,
  meta,
  tone = "neutral",
  className,
}: InsightCardProps) {
  const Icon = GLYPHS[icon];
  const color = toneToColor[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-token-soft bg-surface/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur",
        "dark:bg-surface/70 dark:shadow-[0_22px_50px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-2xl"
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
