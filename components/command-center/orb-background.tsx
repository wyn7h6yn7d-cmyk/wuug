"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type OrbBackgroundProps = {
  className?: string;
  intensity?: "calm" | "loud";
};

export function OrbBackground({ className, intensity = "calm" }: OrbBackgroundProps) {
  const blur = intensity === "loud" ? "blur-[80px]" : "blur-[64px]";
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className={cn(
          "absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full",
          blur,
        )}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--orb-1), transparent 65%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "absolute -right-32 top-10 h-[600px] w-[600px] rounded-full",
          blur,
        )}
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--orb-2), transparent 62%)",
        }}
        animate={{ x: [0, -36, 0], y: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn(
          "absolute left-1/3 top-[55%] h-[680px] w-[680px] -translate-x-1/2 rounded-full",
          blur,
        )}
        style={{
          background:
            "radial-gradient(circle at 40% 40%, var(--orb-3), transparent 60%)",
        }}
        animate={{ x: [0, 28, 0], y: [0, -22, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--orb-veil)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0,rgba(0,0,0,0.0)_40%,rgba(0,0,0,0.04)_100%)] dark:bg-[radial-gradient(transparent_0,rgba(0,0,0,0)_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
