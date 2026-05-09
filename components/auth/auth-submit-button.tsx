"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, LogIn, UserPlus } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

export type AuthSubmitVariant = "sign-in" | "sign-up" | "create-account" | "join-workspace";

const LABEL: Record<AuthSubmitVariant, string> = {
  "sign-in": "Sign in",
  "sign-up": "Create account",
  "create-account": "Create account",
  "join-workspace": "Join workspace",
};

const BUSY_LABEL: Record<AuthSubmitVariant, string> = {
  "sign-in": "Signing in…",
  "sign-up": "Creating account…",
  "create-account": "Creating account…",
  "join-workspace": "Joining workspace…",
};

type AuthSubmitButtonProps = {
  variant: AuthSubmitVariant;
  className?: string;
  disabled?: boolean;
  /** Client-only forms (e.g. register). Server actions set `pending` via `useFormStatus`. */
  busy?: boolean;
};

function AuthSubmitButtonInner({ variant, className, disabled, busy }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isBusy = pending || Boolean(busy);
  const isDisabled = Boolean(disabled) || isBusy;
  const label = isBusy ? BUSY_LABEL[variant] : LABEL[variant];
  const LeftIcon = variant === "join-workspace" || variant === "sign-in" ? LogIn : UserPlus;

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      aria-busy={isBusy}
      whileHover={isDisabled ? undefined : btnHoverLift("primary")}
      whileTap={isDisabled ? undefined : BTN_TAP}
      transition={BTN_SPRING}
      style={isDisabled ? undefined : { willChange: "transform" }}
      className={cn(
        "mt-2 inline-flex w-full min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white select-none",
        "gradient-sheen shadow-[0_16px_36px_rgba(99,102,241,0.38)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:cursor-not-allowed disabled:opacity-85 disabled:hover:scale-100",
        !isBusy && "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5",
        className,
      )}
    >
      {isBusy ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <LeftIcon className="h-4 w-4" aria-hidden />
      )}
      <span className="min-w-0 text-center">{label}</span>
      {isBusy ? <span className="w-4 shrink-0" aria-hidden /> : <ArrowRight className="h-4 w-4 shrink-0 opacity-90" aria-hidden />}
    </motion.button>
  );
}

export function AuthSubmitButton(props: AuthSubmitButtonProps) {
  return <AuthSubmitButtonInner {...props} />;
}
