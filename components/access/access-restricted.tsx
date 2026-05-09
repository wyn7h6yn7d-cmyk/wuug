"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type AccessRestrictedProps = {
  backHref?: string;
};

export function AccessRestricted({ backHref = "/" }: AccessRestrictedProps) {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title="Manager access required" subtitle="You do not have permission to view this area." />
      </FadeIn>
      <FadeIn delay={0.06}>
        <SurfaceCard className="p-6">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Manager access required</p>
            <p className="mt-1 text-sm text-slate-600">You do not have permission to view this area.</p>
            <div className="mt-5">
              <Link
                href={backHref}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(97,107,255,0.24)] hover:opacity-95 active:scale-[0.99]"
              >
                Back to My Day
              </Link>
            </div>
          </div>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}

