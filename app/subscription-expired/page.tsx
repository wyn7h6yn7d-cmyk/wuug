import Link from "next/link";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";

export default function SubscriptionExpiredPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <GlassCard className="p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Subscription inactive</h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-soft">
            Access for this whole workspace is turned off — that includes every teammate, not only managers. Common
            reasons: the trial ended without a paid invoice, the subscription date passed, the account was suspended,
            or an administrator paused the company.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg-soft">
            Your data is still stored. After an administrator records payment, extends the term, or removes the pause in
            the Admin panel, everyone in the company can sign in again.
          </p>
          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-token-soft bg-surface/80 px-4 py-3 text-sm font-semibold text-fg hover:bg-surface"
            >
              Back to home
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
