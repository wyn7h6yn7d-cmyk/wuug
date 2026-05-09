import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";
import { signIn } from "@/app/(auth)/actions";
import { ResendConfirmation } from "@/components/auth/resend-confirmation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const created = params.created === "1";
  const confirm = params.confirm === "1";
  const error = params.error === "1";
  const msgParam = params.msg;
  const msg = typeof msgParam === "string" ? decodeURIComponent(msgParam) : null;

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
              Check your email to confirm your account, then come back to sign in.
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.10)] p-3 text-sm text-[rgb(var(--warn))]">
              <div className="font-semibold">Sign-in failed.</div>
              <div className="mt-1">{msg ?? "Please try again."}</div>
            </div>
          ) : null}

          <form action={signIn} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-fg-muted">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-fg-muted">Password</span>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
              />
            </label>

            <button className="mt-2 w-full rounded-2xl gradient-sheen px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(99,102,241,0.32)] hover:opacity-95 active:scale-[0.99]">
              Sign in
            </button>
          </form>

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
