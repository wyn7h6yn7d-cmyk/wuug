"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

type GradientButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  children?: React.ReactNode;
};

const variantStyles: Record<NonNullable<GradientButtonProps["variant"]>, string> = {
  primary:
    "text-white shadow-[0_16px_36px_rgba(99,102,241,0.38)] gradient-sheen hover:shadow-[0_20px_44px_rgba(99,102,241,0.48)]",
  secondary:
    "text-fg bg-surface/80 dark:bg-surface/70 border border-token-soft shadow-[0_10px_28px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)]",
  ghost: "text-fg-muted hover:bg-surface/70 border border-transparent",
};

const sizeStyles: Record<NonNullable<GradientButtonProps["size"]>, string> = {
  sm: "h-9 rounded-2xl px-3 text-sm",
  md: "h-11 rounded-[22px] px-4 text-sm",
};

export function GradientButton({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  ...props
}: GradientButtonProps) {
  const lift = variant === "primary" ? "primary" : variant === "secondary" ? "secondary" : "ghost";

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : btnHoverLift(lift)}
      whileTap={disabled ? undefined : BTN_TAP}
      transition={BTN_SPRING}
      style={disabled ? undefined : { willChange: "transform" }}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-semibold outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out",
        variant !== "ghost" && "hover:[&_svg]:translate-x-0.5",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
