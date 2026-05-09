"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export function ResendConfirmation() {
  const supabase = React.useMemo(() => createClient(), []);
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-800">Didn’t get the email?</div>
      <div className="mt-1 text-sm text-slate-500">
        Enter your email and we’ll resend the confirmation link.
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="name@company.com"
          className="w-full flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          disabled={state === "sending" || email.trim().length === 0}
          onClick={async () => {
            setState("sending");
            const { error } = await supabase.auth.resend({
              type: "signup",
              email: email.trim(),
            });
            setState(error ? "error" : "sent");
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Resend"}
        </button>
      </div>

      {state === "sent" ? (
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Confirmation email sent. Check your inbox (and spam).
        </div>
      ) : null}
      {state === "error" ? (
        <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
          Could not resend. Please double-check the email and try again.
        </div>
      ) : null}
    </div>
  );
}

