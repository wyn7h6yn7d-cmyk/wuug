import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  showText?: boolean;
};

export function BrandLogo({ className, showText = true }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl gradient-sheen shadow-[0_10px_28px_rgba(99,102,241,0.4)]">
        <span className="absolute inset-[3px] rounded-[12px] bg-surface/85 dark:bg-surface/70" />
        <span className="relative h-2 w-2 rounded-full bg-gradient-to-br from-[rgb(var(--accent))] via-[rgb(var(--accent-2))] to-[rgb(var(--accent-3))]" />
        <span className="absolute inset-0 rounded-2xl pulse-ring" aria-hidden />
      </span>
      {showText ? (
        <span className="text-xl font-semibold tracking-tight text-fg">wuug</span>
      ) : null}
    </div>
  );
}
