"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/ui/page-header";
import { SurfaceCard } from "@/components/ui/surface-card";

type AccessRestrictedProps = {
  backHref?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AccessRestricted({
  backHref = "/",
  title = "Access restricted",
  subtitle = "You do not have permission to view this area.",
  ctaLabel = "Go back",
  secondaryHref,
  secondaryLabel,
}: AccessRestrictedProps) {
  return (
    <div className="space-y-6 pb-8">
      <FadeIn>
        <PageHeader title={title} subtitle={subtitle} />
      </FadeIn>
      <FadeIn delay={0.06}>
        <SurfaceCard className="p-6">
          <div className="flex flex-wrap gap-2">
            <Link
              href={backHref}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(97,107,255,0.24)] hover:opacity-95 active:scale-[0.99]"
            >
              {ctaLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center rounded-2xl border border-token-soft bg-surface/80 px-4 py-2.5 text-sm font-semibold text-fg hover:bg-surface"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </SurfaceCard>
      </FadeIn>
    </div>
  );
}
