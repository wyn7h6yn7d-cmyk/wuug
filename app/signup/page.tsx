import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SurfaceCard } from "@/components/ui/surface-card";
import { signUp } from "@/app/(auth)/actions";

export default async function SignupPage({
  searchParams,
}: {
  // Next.js (this repo version) passes `searchParams` as a Promise.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error === "1";
  const msgParam = resolvedSearchParams?.msg;
  const msg = typeof msgParam === "string" ? decodeURIComponent(msgParam) : null;
  return (
    <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo />
        </div>

        <SurfaceCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-500">Start using wuug in a couple of minutes.</p>

          {error ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
              <div className="font-semibold">Sign-up failed.</div>
              <div className="mt-1">{msg ?? "Please try again."}</div>
            </div>
          ) : null}

          <form action={signUp} className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Company name</span>
              <input
                name="organization_name"
                type="text"
                required
                placeholder="My company"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">First name</span>
                <input
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Last name</span>
                <input
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </label>
            </div>

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
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </label>

            <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)] hover:opacity-95 active:scale-[0.99]">
              Create account
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-700 hover:underline">
              Sign in
            </Link>
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}

