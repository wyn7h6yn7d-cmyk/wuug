"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Handshake,
  LogIn,
  Radar as RadarIcon,
  ShieldAlert,
  Sparkles,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { CommandBar } from "@/components/command-center/command-bar";
import { GlassCard } from "@/components/command-center/glass-card";
import { PressableLink } from "@/components/ui/pressable-link";
import { InsightCard } from "@/components/command-center/insight-card";
import { NextBestAction } from "@/components/command-center/next-best-action";
import { OrbBackground } from "@/components/command-center/orb-background";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { RadarVisual } from "@/components/command-center/radar-visual";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const heroChips = [
  { key: "plan", label: "Build my plan" },
  { key: "stuck", label: "Show stuck clients" },
  { key: "risks", label: "Find project risks" },
  { key: "next", label: "What should I do next?" },
];

export function LandingHero() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground intensity="loud" />

      {/* Header */}
      <header className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <BrandLogo />
        <nav className="flex items-center gap-2">
          <ThemeToggle size="sm" className="hidden sm:inline-flex" />
          <PressableLink href="/login" variant="secondary" size="sm" className="hidden sm:inline-flex">
            <LogIn className="h-4 w-4" />
            Log in
          </PressableLink>
          <PressableLink href="/signup" variant="primary" size="sm">
            <UserPlus className="h-4 w-4" />
            Register
            <ArrowRight className="h-4 w-4" />
          </PressableLink>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap items-center gap-2"
        >
          <PulseBadge label="Live business radar" tone="accent" />
          <PulseBadge label="AI command center" tone="neutral" />
        </motion.div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start xl:gap-12">
          {/* Left column */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-[58px] lg:leading-[1.05]"
            >
              See what needs the next step —{" "}
              <span className="bg-gradient-to-r from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-3))] bg-clip-text text-transparent">
                before anything is forgotten.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
              className="mt-5 max-w-2xl text-pretty text-base text-fg-soft sm:text-lg"
            >
              Wuug turns team activity, client work, promises, and risks into one
              intelligent command center. A nervous system for service businesses,
              not another CRM.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-7"
            >
              <CommandBar chips={heroChips} decorative />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <PressableLink href="/signup" variant="primary" fullWidth className="sm:w-auto">
                <UserPlus className="h-4 w-4" />
                Create your workspace
                <ArrowRight className="h-4 w-4" />
              </PressableLink>
              <PressableLink href="/login" variant="secondary" fullWidth className="sm:w-auto">
                <LogIn className="h-4 w-4" />
                Log in
              </PressableLink>
            </motion.div>

            {/* Floating insight cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InsightCard
                icon={ShieldAlert}
                tone="risk"
                label="Risk Radar"
                value="4 at-risk projects"
                meta="2 deadlines this week"
              />
              <InsightCard
                icon={Clock}
                tone="warn"
                label="Waiting on Client"
                value="3 blocked items"
                meta="Stuck for 5+ days"
              />
              <InsightCard
                icon={Handshake}
                tone="accent"
                label="Promises Due"
                value="5 this week"
                meta="2 expire today"
              />
              <InsightCard
                icon={Users}
                tone="neutral"
                label="Team Pulse"
                value="2 overloaded"
                meta="Rebalance recommended"
                className="hidden sm:block"
              />
              <InsightCard
                icon={AlertTriangle}
                tone="warn"
                label="Missing Owners"
                value="3 unassigned"
                meta="Auto-suggest available"
                className="hidden lg:block"
              />
              <InsightCard
                icon={Zap}
                tone="calm"
                label="Today's Focus"
                value="6 actions queued"
                meta="Built by AI"
                className="hidden lg:block"
              />
            </div>
          </div>

          {/* Right column — Live radar + Next Best Action stacked (no overlap) */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex flex-col gap-4"
            >
              {/* Radar centerpiece */}
              <GlassCard className="relative z-0 overflow-hidden p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.10)] px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--accent))]">
                      <RadarIcon className="h-3.5 w-3.5" /> Live radar
                    </span>
                  </div>
                  <PulseBadge label="3 critical" tone="risk" />
                </div>

                <div className="mt-4 grid items-center gap-4 sm:grid-cols-[260px_1fr]">
                  <div className="relative mx-auto w-full max-w-[280px]">
                    <RadarVisual
                      blips={[
                        { id: "1", angle: 200, distance: 0.85, tone: "rose", size: "lg" },
                        { id: "2", angle: 70, distance: 0.55, tone: "orange", size: "md" },
                        { id: "3", angle: 320, distance: 0.7, tone: "violet", size: "md" },
                        { id: "4", angle: 130, distance: 0.4, tone: "blue", size: "sm" },
                        { id: "5", angle: 250, distance: 0.32, tone: "neutral", size: "sm" },
                        { id: "6", angle: 25, distance: 0.78, tone: "rose", size: "sm" },
                      ]}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-2xl border border-[rgb(var(--risk)/0.35)] bg-[rgb(var(--risk)/0.08)] px-3.5 py-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--risk))]">
                        Critical
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-fg">
                        Project: Website rebuild · Nordic OÜ
                      </div>
                      <div className="text-xs text-fg-soft">Promise expires today · no owner step</div>
                    </div>
                    <div className="rounded-2xl border border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.08)] px-3.5 py-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgb(var(--warn))]">
                        Stuck
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-fg">Lead: Wave OÜ</div>
                      <div className="text-xs text-fg-soft">No activity for 6 days</div>
                    </div>
                    <div className="rounded-2xl border border-token-soft bg-surface/70 px-3.5 py-2.5">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-soft">
                        Watching
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-fg">2 client follow-ups overdue</div>
                      <div className="text-xs text-fg-soft">Auto-grouped by client</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                className="relative z-10 w-full"
              >
                <NextBestAction solid />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* How it works rail */}
        <section className="mt-16 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "1 · See risk before it bites",
              body:
                "Radar continuously scans clients, projects, tasks, and promises for stuck or quiet work and surfaces what needs your eyes today.",
              icon: RadarIcon,
            },
            {
              title: "2 · Decide with one card",
              body:
                "Next Best Action gives one clear, contextual move — not a feed of noise. AI drafts a message, sets the next step, or assigns an owner.",
              icon: Sparkles,
            },
            {
              title: "3 · Keep promises kept",
              body:
                "Promises are first-class. Owners, deadlines, and follow-ups are tracked so nothing slips between meetings.",
              icon: CheckCircle2,
            },
          ].map((item) => (
            <GlassCard key={item.title} className="p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-token-soft bg-surface/70 text-[rgb(var(--accent))]">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm text-fg-soft">{item.body}</p>
            </GlassCard>
          ))}
        </section>

        <footer className="mt-16 border-t border-token-soft pt-8 text-sm text-fg-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Wuug</div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-fg">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-fg">
                Register
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
