import { cn } from "@/lib/utils";

type StatusTone = "blue" | "violet" | "orange" | "green" | "neutral";

const toneStyles: Record<StatusTone, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  orange: "bg-orange-50 text-orange-700 border-orange-100",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
