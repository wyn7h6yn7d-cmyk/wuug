import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";
import { signUp } from "@/app/(auth)/actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { safeDecodeURIComponent } from "@/lib/safe-decode";

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error === "1";
  const msg = safeDecodeURIComponent(resolvedSearchParams?.msg);

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <BrandLogo />
          <ThemeToggle size="sm" />
        </div>

        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Create your workspace</h1>
          <p className="mt-2 text-sm text-fg-soft">A fresh command center in two minutes.</p>

          {error ? (
            <div className="mt-4 rounded-2xl border border-[rgb(var(--warn)/0.35)] bg-[rgb(var(--warn)/0.10)] p-3 text-sm text-[rgb(var(--warn))]">
              <div className="font-semibold">Sign-up failed.</div>
              <div className="mt-1">{msg ?? "Please try again."}</div>
            </div>
          ) : null}

          <form action={signUp} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-fg-muted">Company name</span>
              <input
                name="organization_name"
                type="text"
                required
                placeholder="My company"
                className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-fg-muted">First name</span>
                <input
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First"
                  className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-fg-muted">Last name</span>
                <input
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last"
                  className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
                />
              </label>
            </div>

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
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-token-soft bg-surface/70 px-3 py-2.5 text-sm text-fg placeholder:text-fg-soft focus:outline-none"
              />
            </label>

            <AuthSubmitButton variant="sign-up" />
          </form>

          <p className="mt-4 text-sm text-fg-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[rgb(var(--accent))] hover:underline">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
