import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
};

export function GlassCard({ children, className, as = "section" }: GlassCardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/60 bg-white/55 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl",
        "ring-1 ring-slate-900/[0.04]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,0.12),transparent_55%),radial-gradient(900px_520px_at_110%_10%,rgba(20,184,166,0.10),transparent_50%)]" />
      <div className="relative">{children}</div>
    </Component>
  );
}

