"use client";

import * as React from "react";
import { GlassCard } from "@/components/command-center/glass-card";
import { PageHeader } from "@/components/ui/page-header";
import { PressableLink } from "@/components/ui/pressable-link";
import { cn } from "@/lib/utils";

type SectionPlaceholderViewProps = {
  title: string;
  subtitle: string;
  highlights: string[];
};

export function SectionPlaceholderView({ title, subtitle, highlights }: SectionPlaceholderViewProps) {
  const [selected, setSelected] = React.useState<string | null>(highlights[0] ?? null);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeader title={title} subtitle={subtitle} />
        <div className="flex items-center gap-2">
          <PressableLink href="/tasks" variant="secondary" size="sm">
            Open tasks
          </PressableLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-fg">{title}</h2>
          <p className="mt-2 text-sm text-fg-soft">
            Choose a focus area below. Full controls will land here in a future update.
          </p>
          <ul className="mt-4 list-none space-y-2 p-0" aria-label={`${title} areas`}>
            {highlights.map((item) => {
              const isSelected = selected === item;
              return (
                <li key={item}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(item)}
                    className={cn(
                      "w-full cursor-pointer rounded-[22px] border px-4 py-3.5 text-left text-sm font-semibold transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                      isSelected
                        ? "border-[rgb(var(--accent)/0.45)] bg-[rgb(var(--accent)/0.14)] text-fg shadow-[0_10px_28px_rgba(99,102,241,0.15)] dark:shadow-[0_10px_32px_rgba(0,0,0,0.35)]"
                        : "border-token-soft bg-surface/80 text-fg hover:border-[rgb(var(--accent)/0.28)] hover:bg-surface",
                    )}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
          {selected ? (
            <p className="mt-4 rounded-2xl border border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
              <span className="font-medium text-fg">{selected}</span> — configuration is not available yet. Team and
              workspace tools are on the roadmap.
            </p>
          ) : null}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-fg">Shortcuts</h3>
          <p className="mt-2 text-sm text-fg-soft">
            Jump elsewhere while this page is still filling out.
          </p>
          <div className="mt-4 grid gap-2">
            <PressableLink href="/tasks" variant="primary" fullWidth>
              Create plan
            </PressableLink>
            <PressableLink href="/clients" variant="secondary" fullWidth>
              Draft message
            </PressableLink>
            <PressableLink href="/radar" variant="ghost" fullWidth>
              Open radar
            </PressableLink>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
