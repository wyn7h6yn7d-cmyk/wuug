import Link from "next/link";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";

type Props = {
  searchParams?: Promise<{ reason?: string }>;
};

export default async function AccountSuspendedPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const reason = sp.reason?.trim();

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <GlassCard className="p-8">
          <h1 className="text-2xl font-semibold tracking-tight">Account access suspended</h1>
          <p className="mt-3 text-sm leading-relaxed text-fg-soft">
            This login is not allowed to use Wuug right now. If you think this is a mistake, contact your administrator
            or support.
          </p>
          {reason ? (
            <p className="mt-4 rounded-2xl border border-token-soft bg-surface/60 px-4 py-3 text-sm text-fg-soft">
              <span className="font-medium text-fg">Note:</span> {reason}
            </p>
          ) : null}
          <div className="mt-8">
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
