"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { BTN_SPRING, BTN_TAP } from "@/lib/motion-presets";

type ThemeToggleProps = {
  className?: string;
  size?: "sm" | "md";
};

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  const dim = size === "sm" ? "h-9" : "h-11";

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={BTN_TAP}
      whileHover={{ scale: 1.03 }}
      transition={BTN_SPRING}
      className={cn(
        "relative inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-1 pr-3 text-xs font-semibold outline-none",
        "border-token-soft bg-surface/70 backdrop-blur",
        "shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]",
        "text-fg-muted hover:text-fg",
        "focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        dim,
        className,
      )}
    >
      <span className="relative inline-flex h-7 w-14 items-center rounded-full border border-token-soft bg-bg2/80">
        <motion.span
          className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-3))] shadow-[0_6px_18px_rgba(99,102,241,0.45)]"
          animate={{ left: isDark ? 28 : 4 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        />
        <Sun className={cn("absolute left-1.5 h-3.5 w-3.5", isDark ? "text-fg-soft" : "text-white")} />
        <Moon className={cn("absolute right-1.5 h-3.5 w-3.5", isDark ? "text-white" : "text-fg-soft")} />
      </span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </motion.button>
  );
}
