"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP, btnHoverLift } from "@/lib/motion-presets";

const MotionLink = motion(Link);

type PressableLinkProps = {
  href: string;
  variant: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md";
};

export function PressableLink({
  href,
  variant,
  className,
  children,
  fullWidth,
  size = "md",
}: PressableLinkProps) {
  const lift = variant === "ghost" ? "ghost" : variant === "primary" ? "primary" : "secondary";

  return (
    <MotionLink
      href={href}
      className={cn(
        fullWidth && "w-full",
        "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold whitespace-nowrap select-none",
        size === "sm" ? "min-h-10 rounded-2xl px-3.5 py-2.5 text-sm" : "min-h-11 rounded-[22px] px-4 text-sm",
        "outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        variant === "primary" &&
          "gradient-sheen text-white shadow-[0_16px_36px_rgba(99,102,241,0.38)] hover:shadow-[0_20px_44px_rgba(99,102,241,0.48)]",
        variant === "secondary" &&
          "border border-token-soft bg-surface/80 text-fg shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur dark:bg-surface/70 dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)]",
        variant === "ghost" &&
          "border border-transparent bg-surface/40 text-fg-muted shadow-none backdrop-blur hover:border-token-soft hover:bg-surface/70 hover:text-fg dark:bg-transparent",
        "[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-out",
        "hover:[&_svg]:translate-x-0.5",
        className,
      )}
      whileHover={btnHoverLift(lift)}
      whileTap={BTN_TAP}
      transition={BTN_SPRING}
    >
      {children}
    </MotionLink>
  );
}
