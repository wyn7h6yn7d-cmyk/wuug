import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SurfaceCard } from "@/components/ui/surface-card";
import { signIn } from "@/app/(auth)/actions";
import { ResendConfirmation } from "@/components/auth/resend-confirmation";

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
    <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo />
        </div>

        <SurfaceCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Continue to your workspace.</p>

          {created ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Account created. Sign in to continue.
            </div>
          ) : null}
          {confirm ? (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              Check your email to confirm your account, then come back to sign in.
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
              <div className="font-semibold">Sign-in failed.</div>
              <div className="mt-1">{msg ?? "Please try again."}</div>
            </div>
          ) : null}

          <form action={signIn} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)] hover:opacity-95 active:scale-[0.99]">
              Sign in
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-blue-700 hover:underline">
              Create one
            </Link>
          </p>

          {confirm ? <ResendConfirmation /> : null}
        </SurfaceCard>
      </div>
    </div>
  );
}

