import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { createClient } from "@/lib/supabase/server";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";
import { GradientButton } from "@/components/command-center/gradient-button";
import { PulseBadge } from "@/components/command-center/pulse-badge";
import { ArrowRight, CheckCircle2, Radar, Sparkles, Users } from "lucide-react";

export default async function LandingPage() {
  // If already logged in, go straight into the product.
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/app");

  return (
    <div className="relative min-h-screen bg-[#F7FAFF] text-slate-900">
      <OrbBackground />

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <BrandLogo />
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur hover:bg-white"
          >
            Log in
          </Link>
          <Link href="/signup">
            <GradientButton>
              Register <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <PulseBadge label="AI business command center" tone="calm" />
              <PulseBadge label="Built for small teams" tone="neutral" />
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              wuug shows what needs the next step — before anything gets stuck.
            </h1>
            <p className="max-w-2xl text-pretty text-base text-slate-600 sm:text-lg">
              A calm command center for service businesses. Track clients, projects, tasks and promises — and let Radar
              surface risks automatically.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link href="/signup">
                <GradientButton className="w-full sm:w-auto">
                  Create your workspace <ArrowRight className="h-4 w-4" />
                </GradientButton>
              </Link>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur hover:bg-white sm:w-auto"
              >
                Log in
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Radar, title: "Radar", desc: "Stuck work, missing owners, overdue promises." },
                { icon: Sparkles, title: "Next best action", desc: "Focus-first plan for today." },
                { icon: Users, title: "Team visibility", desc: "Managers can invite and track teammates." },
              ].map((item) => (
                <GlassCard key={item.title} className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 shadow-sm ring-1 ring-slate-900/[0.03]">
                      <item.icon className="h-5 w-5 text-slate-700" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <GlassCard className="p-6">
              <div className="text-sm font-semibold text-slate-900">How it works</div>
              <div className="mt-4 space-y-3">
                {[
                  { title: "1) Create your workspace", desc: "Register and become a manager automatically." },
                  { title: "2) Invite your team", desc: "Create invite links for teammates to join." },
                  { title: "3) Add clients & next steps", desc: "Keep work moving with one clear step per client." },
                  { title: "4) Let Radar monitor risk", desc: "See what’s stuck, overdue, or missing an owner." },
                ].map((step) => (
                  <div
                    key={step.title}
                    className="rounded-[22px] border border-white/70 bg-white/55 px-4 py-3 shadow-sm ring-1 ring-slate-900/[0.03]"
                  >
                    <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{step.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Built with Supabase + strict RLS
                </div>
                <div className="mt-1 text-sm text-emerald-700">
                  Your data stays scoped to your organization by default.
                </div>
              </div>
            </GlassCard>
          </aside>
        </div>

        <footer className="mt-12 border-t border-white/60 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} wuug</div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-slate-700">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-slate-700">
                Register
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

