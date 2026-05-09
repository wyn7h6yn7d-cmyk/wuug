import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
  glow?: boolean;
  /** Nearly opaque surface — use when stacking on other glass to avoid text bleed-through */
  solid?: boolean;
};

export function GlassCard({
  children,
  className,
  as = "section",
  glow = true,
  solid = false,
}: GlassCardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[28px]",
        solid
          ? "border border-token-soft bg-surface/96 shadow-[0_24px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl dark:bg-[rgb(26_33_56/0.96)] dark:shadow-[0_28px_70px_rgba(0,0,0,0.5)]"
          : "glass",
        "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
        className,
      )}
    >
      {glow && !solid ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            /* Top layers = radials; bottom layer = even vertical wash so transparent zones aren’t “empty”. */
            background:
              "radial-gradient(1200px 600px at 20% -10%, rgb(var(--accent) / 0.18), transparent 55%)," +
              "radial-gradient(900px 520px at 110% 10%, rgb(var(--accent-3) / 0.14), transparent 50%)," +
              "linear-gradient(180deg, rgb(var(--surface-strong) / 0.42) 0%, rgb(var(--surface) / 0.52) 100%)",
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </Component>
  );
}
