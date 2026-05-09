"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export function SettingsView() {
  return (
    <div className="space-y-6 pb-10">
      <FadeIn>
        <PageHeader title="Settings" subtitle="Workspace preferences (placeholder)." />
      </FadeIn>
      <FadeIn delay={0.06}>
        <SurfaceCard className="p-6">
          <p className="text-sm text-slate-600">Settings UI is under construction.</p>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
