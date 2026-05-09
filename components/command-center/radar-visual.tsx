"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type RadarBlip = {
  id: string;
  /** angle in degrees (0 = right, 90 = bottom) */
  angle: number;
  /** distance from center, 0..1 */
  distance: number;
  tone?: "violet" | "orange" | "blue" | "neutral" | "rose";
  size?: "sm" | "md" | "lg";
  label?: string;
};

const toneToColor: Record<NonNullable<RadarBlip["tone"]>, string> = {
  violet: "rgb(168 85 247)",
  orange: "rgb(251 146 60)",
  blue: "rgb(99 102 241)",
  neutral: "rgb(148 163 184)",
  rose: "rgb(248 113 113)",
};

type RadarVisualProps = {
  blips?: RadarBlip[];
  className?: string;
  /** show severity rings */
  rings?: number[];
  showScan?: boolean;
};

export function RadarVisual({
  blips = [],
  className,
  rings = [22, 36, 48],
  showScan = true,
}: RadarVisualProps) {
  return (
    <div className={cn("relative aspect-square w-full overflow-hidden rounded-full", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="wuugRadarGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgb(var(--accent) / 0.30)" />
            <stop offset="40%" stopColor="rgb(var(--accent-3) / 0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="wuugRadarRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent) / 0.55)" />
            <stop offset="50%" stopColor="rgb(var(--accent-2) / 0.45)" />
            <stop offset="100%" stopColor="rgb(var(--accent-3) / 0.45)" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="48" fill="url(#wuugRadarGlow)" />

        {rings.map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#wuugRadarRing)"
            strokeWidth="0.6"
            opacity="0.85"
          />
        ))}

        <line x1="50" y1="2" x2="50" y2="98" stroke="rgb(var(--fg) / 0.10)" strokeWidth="0.5" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="rgb(var(--fg) / 0.10)" strokeWidth="0.5" />
        <line x1="14" y1="14" x2="86" y2="86" stroke="rgb(var(--fg) / 0.06)" strokeWidth="0.5" />
        <line x1="86" y1="14" x2="14" y2="86" stroke="rgb(var(--fg) / 0.06)" strokeWidth="0.5" />

        {blips.map((b) => {
          const rad = (b.angle * Math.PI) / 180;
          const cx = 50 + Math.cos(rad) * b.distance * 44;
          const cy = 50 + Math.sin(rad) * b.distance * 44;
          const size = b.size === "lg" ? 2.6 : b.size === "sm" ? 1.5 : 2.0;
          const color = toneToColor[b.tone ?? "blue"];
          return (
            <g key={b.id}>
              <circle cx={cx} cy={cy} r={size + 3.5} fill={color} opacity="0.18" />
              <circle cx={cx} cy={cy} r={size} fill={color}>
                <animate attributeName="opacity" values="0.85;1;0.85" dur="2.6s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Sweep: full-size layer, gradient anchored at geometric center; rotate around center (default origin). */}
      {showScan ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          aria-hidden
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgb(var(--accent) / 0.48) 14deg, rgb(var(--accent-3) / 0.22) 24deg, transparent 38deg)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}

      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <span className="absolute inset-0 -m-2 rounded-full bg-[rgb(var(--accent)/0.18)] blur-md" />
          <span className="relative block h-2.5 w-2.5 rounded-full bg-[rgb(var(--accent))] shadow-[0_0_24px_rgb(var(--accent))]" />
        </div>
      </div>
    </div>
  );
}
