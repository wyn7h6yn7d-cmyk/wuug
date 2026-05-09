"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type OrbBackgroundProps = {
  className?: string;
};

export function OrbBackground({ className }: OrbBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.22),rgba(99,102,241,0.10),transparent_65%)] blur-2xl"
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-28 top-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(20,184,166,0.20),rgba(20,184,166,0.08),transparent_62%)] blur-2xl"
        animate={{ x: [0, -36, 0], y: [0, 18, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-[55%] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(168,85,247,0.16),rgba(168,85,247,0.06),transparent_60%)] blur-3xl"
        animate={{ x: [0, 28, 0], y: [0, -22, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(255,255,255,0.55),transparent_55%)]" />
    </div>
  );
}

