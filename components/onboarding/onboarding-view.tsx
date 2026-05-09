"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { onboardingSteps } from "@/lib/mock-data";

export function OnboardingView() {
  return (
    <div className="space-y-6 pb-10">
      <FadeIn>
        <PageHeader title="Onboarding" subtitle="A quick checklist to get your workspace ready." />
      </FadeIn>

      <FadeIn delay={0.06}>
        <SurfaceCard>
          <div className="space-y-3">
            {onboardingSteps.map((step, idx) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">
                    {idx + 1}. {step}
                  </div>
                  <div className="text-xs text-slate-500">Recommended next step</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Preview Reports
            </Link>
          </div>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
