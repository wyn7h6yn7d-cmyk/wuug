"use client";

import Link from "next/link";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/client";

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
        <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex justify-center">
              <BrandLogo />
            </div>
            <SurfaceCard className="p-6 sm:p-8">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Register</h1>
              <p className="mt-2 text-sm text-slate-500">Loading…</p>
            </SurfaceCard>
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
    <div className="min-h-screen bg-[#F7FAFF] p-4 sm:p-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex justify-center">
          <BrandLogo />
        </div>

        <SurfaceCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Register</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>

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
                  setFormError("Registration failed. Please check your details and try again.");
                  setIsSubmitting(false);
                  return;
                }

                // If email confirmations are enabled, there may be no session yet.
                if (inviteToken && signUpData.session) {
                  const { data: acceptData, error: acceptError } = await supabase.rpc("accept_invitation", {
                    p_token: inviteToken,
                    p_full_name: fullName || "",
                  });

                  if (acceptError) {
                    setFormError("Invite acceptance failed. Please contact your manager for a new invite link.");
                    setIsSubmitting(false);
                    return;
                  }

                  const role = (acceptData as string) ?? "member";
                  router.replace(role === "manager" ? "/manager" : "/my-day");
                  return;
                }

                // If email confirmations are enabled, there may be no session yet.
                if (!signUpData.session) {
                  router.replace("/login?confirm=1");
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

            <button
              disabled={isSubmitting || (Boolean(inviteToken) && (isLoadingInvite || inviteError))}
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(97,107,255,0.28)] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
            >
              {inviteToken ? "Join workspace" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-700 hover:underline">
              Log in
            </Link>
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}

