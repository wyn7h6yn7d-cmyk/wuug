"use client";

import Link from "next/link";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { OrbBackground } from "@/components/command-center/orb-background";
import { GlassCard } from "@/components/command-center/glass-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PENDING_INVITE_KEY } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/client";

function formatAuthError(message: string | undefined): string {
  const t = (message ?? "").trim();
  if (!t) return "Registration failed. Please check your details and try again.";
  return t.length > 220 ? `${t.slice(0, 217)}…` : t;
}

type InviteInfo = {
  organization_id: string;
  organization_name: string;
  email: string;
  role: "manager" | "member";
  expires_at: string | null;
  created_at: string;
};

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="relative min-h-screen overflow-hidden bg-app text-fg">
          <OrbBackground />
          <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:py-10">
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo />
              <ThemeToggle size="sm" />
            </div>
            <GlassCard className="p-6 sm:p-8">
              <h1 className="text-2xl font-semibold tracking-tight text-fg">Register</h1>
              <p className="mt-2 text-sm text-fg-soft">Loading…</p>
            </GlassCard>
          </div>
        </div>
      }
    >
      <RegisterPageInner />
    </React.Suspense>
  );
}

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const supabase = useMemo(() => createClient(), []);

  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [inviteError, setInviteError] = useState(false);
  const [isLoadingInvite, setIsLoadingInvite] = useState(Boolean(inviteToken));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!inviteToken) return;

    async function loadInvite() {
      setIsLoadingInvite(true);
      setInviteError(false);
      setInvite(null);

      const { data, error } = await supabase.rpc("get_invitation_public", { p_token: inviteToken });
      if (cancelled) return;

      const row = Array.isArray(data) ? (data[0] as InviteInfo | undefined) : (data as InviteInfo | null);
      if (error || !row?.email) {
        setInviteError(true);
        setInvite(null);
      } else {
        setInvite(row);
      }
      setIsLoadingInvite(false);
    }

    void loadInvite();
    return () => {
      cancelled = true;
    };
  }, [inviteToken, supabase]);

  const subtitle = inviteToken
    ? "Join your team workspace with an invitation."
    : "Create your workspace and start in minutes.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-app text-fg">
      <OrbBackground />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between">
          <BrandLogo />
          <ThemeToggle size="sm" />
        </div>

        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Register</h1>
          <p className="mt-2 text-sm text-fg-soft">{subtitle}</p>

          {inviteToken ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              {isLoadingInvite ? (
                <span>Loading invitation…</span>
              ) : inviteError ? (
                <span className="text-orange-700">Invitation link is invalid or expired.</span>
              ) : invite ? (
                <span>
                  You’re joining <span className="font-semibold">{invite.organization_name}</span> as{" "}
                  <span className="font-semibold">{invite.role === "manager" ? "Manager" : "Team Member"}</span>.
                  <span className="mt-2 block text-xs text-slate-600">
                    Wuug does not email this link—whoever invited you should send it (Slack, text, etc.). If your project
                    uses Supabase email confirmation, check your inbox and spam for a message from Supabase after you
                    register.
                  </span>
                </span>
              ) : null}
            </div>
          ) : null}

          {formError ? (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
              {formError}
            </div>
          ) : null}

          <form
            className="mt-5 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              setFormError(null);
              setIsSubmitting(true);

              const fd = new FormData(event.currentTarget);
              const organizationName = String(fd.get("organization_name") ?? "");
              const firstName = String(fd.get("first_name") ?? "");
              const lastName = String(fd.get("last_name") ?? "");
              const fullName = [firstName, lastName].map((p) => p.trim()).filter(Boolean).join(" ");
              const email = String(fd.get("email") ?? "");
              const password = String(fd.get("password") ?? "");

              try {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: {
                      full_name: fullName || null,
                      organization_name: inviteToken ? null : organizationName || null,
                    },
                  },
                });

                if (signUpError) {
                  setFormError(formatAuthError(signUpError.message));
                  setIsSubmitting(false);
                  return;
                }

                if (inviteToken && signUpData.session) {
                  const { data: acceptData, error: acceptError } = await supabase.rpc("accept_invitation", {
                    p_token: inviteToken,
                    p_full_name: fullName || "",
                  });

                  if (acceptError) {
                    setFormError(formatAuthError(acceptError.message));
                    setIsSubmitting(false);
                    return;
                  }

                  const role = (acceptData as string) ?? "member";
                  router.replace(role === "manager" ? "/manager" : "/my-day");
                  return;
                }

                if (!signUpData.session) {
                  if (inviteToken && typeof window !== "undefined") {
                    try {
                      sessionStorage.setItem(PENDING_INVITE_KEY, inviteToken);
                    } catch {
                      /* private mode */
                    }
                  }
                  const next = inviteToken
                    ? `/login?confirm=1&invite=${encodeURIComponent(inviteToken)}`
                    : "/login?confirm=1";
                  router.replace(next);
                } else {
                  router.replace("/login?created=1");
                }
              } catch {
                setFormError("Registration failed. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Company name</span>
              <input
                name="organization_name"
                type="text"
                required={!inviteToken}
                disabled={Boolean(inviteToken)}
                defaultValue={invite?.organization_name ?? ""}
                placeholder="My company LLC"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none"
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
                defaultValue={invite?.email ?? ""}
                disabled={Boolean(inviteToken)}
                placeholder="name@company.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none"
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

            <AuthSubmitButton
              variant={inviteToken ? "join-workspace" : "create-account"}
              busy={isSubmitting}
              disabled={Boolean(inviteToken) && (isLoadingInvite || inviteError)}
            />
          </form>

          <p className="mt-4 text-sm text-fg-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[rgb(var(--accent))] hover:underline">
              Log in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}

