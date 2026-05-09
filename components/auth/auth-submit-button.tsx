"use client";

import { motion } from "framer-motion";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

export type AuthSubmitVariant = "sign-in" | "sign-up" | "create-account" | "join-workspace";

const LABEL: Record<AuthSubmitVariant, string> = {
  "sign-in": "Sign in",
  "sign-up": "Create account",
  "create-account": "Create account",
  "join-workspace": "Join workspace",
};

type AuthSubmitButtonProps = {
  variant: AuthSubmitVariant;
  className?: string;
  disabled?: boolean;
};

/**
 * Icons and motion live only in this client module so the login/signup pages
 * stay valid Server Components (no icon elements passed across the RSC boundary).
 */
export function AuthSubmitButton({ variant, className, disabled }: AuthSubmitButtonProps) {
  const label = LABEL[variant];
  const LeftIcon = variant === "join-workspace" || variant === "sign-in" ? LogIn : UserPlus;

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      whileHover={disabled ? undefined : btnHoverLift("primary")}
      whileTap={disabled ? undefined : BTN_TAP}
      transition={BTN_SPRING}
      className={cn(
        "mt-2 inline-flex w-full min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white select-none",
        "gradient-sheen shadow-[0_16px_36px_rgba(99,102,241,0.38)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:scale-100",
        "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 hover:[&_svg]:translate-x-0.5",
        className,
      )}
    >
      <LeftIcon className="h-4 w-4" aria-hidden />
      {label}
      <ArrowRight className="h-4 w-4 opacity-90" aria-hidden />
    </motion.button>
  );
}
