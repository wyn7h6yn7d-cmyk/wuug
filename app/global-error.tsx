"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { BTN_SPRING, BTN_TAP } from "@/lib/motion-presets";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const digest = error?.digest;
  const [isReloading, startReload] = React.useTransition();

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7FAFF] p-6 text-slate-900">
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="text-sm font-semibold text-slate-900">Something went wrong</div>
          <p className="mt-2 text-sm text-slate-600">
            Please try again. If the issue persists, contact support
            {digest ? " and share the reference below." : "."}
          </p>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            We couldn’t complete that action. Reloading the page is safe to try.
            {digest ? (
              <div className="mt-2 font-mono text-xs text-slate-500">Reference: {digest}</div>
            ) : null}
            {process.env.NODE_ENV === "development" && error?.message ? (
              <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-500">
                {error.message}
              </pre>
            ) : null}
          </div>
          <motion.button
            type="button"
            disabled={isReloading}
            aria-busy={isReloading}
            onClick={() => startReload(() => reset())}
            whileTap={isReloading ? undefined : BTN_TAP}
            whileHover={isReloading ? undefined : { y: -1, scale: 1.02 }}
            transition={BTN_SPRING}
            style={isReloading ? undefined : { willChange: "transform" }}
            className="mt-4 inline-flex min-h-11 min-w-[8.5rem] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-90"
          >
            {isReloading ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                Reloading…
              </>
            ) : (
              "Reload"
            )}
          </motion.button>
        </div>
      </body>
    </html>
  );
}
