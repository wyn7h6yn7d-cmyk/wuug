"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Check, Sparkles, Clock, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/command-center/glass-card";
import { cn } from "@/lib/utils";

type NextBestActionProps = {
  title?: string;
  subject?: string;
  due?: string;
  reason?: string;
  ctaHref?: string;
  className?: string;
};

export function NextBestAction({
  title = "Next Best Action",
  subject = "Send proposal to Nordic OÜ",
  due = "Due today at 11:00",
  reason = "High-priority client. Promise expires today.",
  ctaHref = "/tasks",
  className,
}: NextBestActionProps) {
  return (
    <GlassCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.10)] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
            <Sparkles className="h-3.5 w-3.5" />
            {title}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-fg-soft">
          <Clock className="h-3.5 w-3.5" />
          {due}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg">{subject}</h3>
      <p className="mt-2 text-sm text-fg-soft">{reason}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={ctaHref}>
          <motion.span
            whileHover={{ y: -1 }}
            className="inline-flex h-10 items-center gap-1.5 rounded-2xl gradient-sheen px-4 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(99,102,241,0.32)]"
          >
            Open <ArrowUpRight className="h-4 w-4" />
          </motion.span>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-2xl border border-token-soft bg-surface/70 px-3 text-sm font-semibold text-fg hover:bg-surface"
        >
          <Check className="h-4 w-4" /> Mark done
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-2xl border border-token-soft bg-surface/70 px-3 text-sm font-semibold text-fg-muted hover:text-fg"
        >
          <Bell className="h-4 w-4" /> Snooze
        </button>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-2xl border border-[rgb(var(--accent-2)/0.35)] bg-[rgb(var(--accent-2)/0.10)] px-3 text-sm font-semibold text-[rgb(var(--accent-2))]"
        >
          <Sparkles className="h-4 w-4" /> Draft with AI
        </button>
      </div>
    </GlassCard>
  );
}
