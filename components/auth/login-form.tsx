"use client";

import * as React from "react";
import { signIn } from "@/app/(auth)/actions";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";

const PENDING_INVITE_KEY = "wuug_pending_invite";

export function LoginForm({ inviteFromQuery }: { inviteFromQuery: string | null }) {
  const [invite, setInvite] = React.useState(inviteFromQuery ?? "");

  React.useEffect(() => {
    if (inviteFromQuery) return;
    try {
      const s = sessionStorage.getItem(PENDING_INVITE_KEY);
      if (s) setInvite(s);
    } catch {
      /* private mode */
    }
  }, [inviteFromQuery]);

  return (
    <form action={signIn} className="mt-5 space-y-3">
      {invite ? <input type="hidden" name="invite" value={invite} readOnly /> : null}
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

      <AuthSubmitButton variant="sign-in" />
      {invite ? (
        <p className="text-xs text-fg-soft">
          After you sign in, we&apos;ll finish joining you to the workspace from your invite.
        </p>
      ) : null}
    </form>
  );
}

export { PENDING_INVITE_KEY };
