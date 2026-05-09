import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";
import { ResendConfirmation } from "@/components/auth/resend-confirmation";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { safeDecodeURIComponent } from "@/lib/safe-decode";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const created = params.created === "1";
  const confirm = params.confirm === "1";
  const error = params.error === "1";
  const msg = safeDecodeURIComponent(params.msg);
  const inviteRaw = params.invite;
  const inviteFromQuery =
    typeof inviteRaw === "string" ? inviteRaw : Array.isArray(inviteRaw) ? (inviteRaw[0] ?? null) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <BrandLogo />
          <ThemeToggle size="sm" />
        </div>

        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Sign in</h1>
          <p className="mt-2 text-sm text-fg-soft">Continue to your command center.</p>

          {created ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Account created. Sign in to continue.
            </div>
          ) : null}
          {confirm ? (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.10)] p-3 text-sm text-[rgb(var(--accent))]">
              <p>Check your email to confirm your account (and spam/junk), then sign in here with the same address.</p>
              {inviteFromQuery ? (
                <p className="mt-2 text-xs text-fg-soft">
                  Your invite is saved for this browser session—after confirming, sign in on this device to finish joining
                  the workspace.
                </p>
              ) : null}
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.10)] p-3 text-sm text-[rgb(var(--warn))]">
              <div className="font-semibold">Sign-in failed.</div>
              <div className="mt-1">{msg ?? "Please try again."}</div>
            </div>
          ) : null}

          <LoginForm inviteFromQuery={inviteFromQuery} />

          <p className="mt-4 text-sm text-fg-muted">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-[rgb(var(--accent))] hover:underline">
              Create one
            </Link>
          </p>

          {confirm ? <ResendConfirmation /> : null}
        </GlassCard>
      </div>
    </div>
  );
}
