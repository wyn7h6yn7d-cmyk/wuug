import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-[#E5EAF3] bg-white/95 p-6 shadow-[0_8px_30px_rgba(66,86,122,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
