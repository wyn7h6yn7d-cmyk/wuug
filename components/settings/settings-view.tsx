"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <FadeIn>
        <PageHeader title="Settings" subtitle="Preferences for your workspace." />
      </FadeIn>
      <FadeIn delay={0.06}>
        <SurfaceCard className="p-6">
          <p className="text-sm text-slate-600">More settings are on the way.</p>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
