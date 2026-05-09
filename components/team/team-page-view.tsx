"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

export function TeamPageView() {
  return (
    <div className="space-y-6 pb-10">
      <FadeIn>
        <PageHeader title="Team" subtitle="Roles, invites, and who’s on the team." />
      </FadeIn>
      <FadeIn delay={0.06}>
        <SurfaceCard className="p-6">
          <p className="text-sm text-slate-600">More team tools are on the way.</p>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
