import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-token bg-surface/95 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur",
        "dark:bg-surface/80 dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
