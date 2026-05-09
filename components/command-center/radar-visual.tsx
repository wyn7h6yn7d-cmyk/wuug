import { cn } from "@/lib/utils";

type RadarBlip = {
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  tone?: "violet" | "orange" | "blue" | "neutral";
};

type RadarVisualProps = {
  blips?: RadarBlip[];
  className?: string;
};

const toneToColor: Record<NonNullable<RadarBlip["tone"]>, string> = {
  violet: "rgba(168,85,247,0.95)",
  orange: "rgba(249,115,22,0.95)",
  blue: "rgba(99,102,241,0.95)",
  neutral: "rgba(100,116,139,0.9)",
};

export function RadarVisual({ blips = [], className }: RadarVisualProps) {
  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <radialGradient id="wuugRadarGlow" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.18)" />
            <stop offset="45%" stopColor="rgba(20,184,166,0.10)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </radialGradient>
          <linearGradient id="wuugRadarRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.26)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.18)" />
            <stop offset="100%" stopColor="rgba(20,184,166,0.18)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="url(#wuugRadarGlow)" />

        {[18, 32, 44].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="url(#wuugRadarRing)"
            strokeWidth="0.8"
            opacity="0.9"
          />
        ))}

        <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(15,23,42,0.10)" strokeWidth="0.7" />
        <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(15,23,42,0.10)" strokeWidth="0.7" />
        <line x1="18" y1="18" x2="82" y2="82" stroke="rgba(15,23,42,0.06)" strokeWidth="0.7" />
        <line x1="82" y1="18" x2="18" y2="82" stroke="rgba(15,23,42,0.06)" strokeWidth="0.7" />

        {blips.map((blip) => {
          const cx = 10 + blip.x * 80;
          const cy = 10 + blip.y * 80;
          const fill = toneToColor[blip.tone ?? "neutral"];
          return (
            <g key={blip.id}>
              <circle cx={cx} cy={cy} r="2.3" fill={fill} />
              <circle cx={cx} cy={cy} r="4.8" fill={fill} opacity="0.18" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

