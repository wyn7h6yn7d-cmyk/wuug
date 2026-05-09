import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
  glow?: boolean;
};

export function GlassCard({ children, className, as = "section", glow = true }: GlassCardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[28px] glass",
        "ring-1 ring-black/[0.04] dark:ring-white/[0.06]",
        className,
      )}
    >
      {glow ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 20% -10%, rgb(var(--accent) / 0.18), transparent 55%)," +
              "radial-gradient(900px 520px at 110% 10%, rgb(var(--accent-3) / 0.14), transparent 50%)",
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </Component>
  );
}
