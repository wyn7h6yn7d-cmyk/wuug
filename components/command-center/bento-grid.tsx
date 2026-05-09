import { cn } from "@/lib/utils";

type BentoGridProps = {
  children: React.ReactNode;
  className?: string;
};

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        "md:grid-cols-2",
        "xl:grid-cols-12 xl:gap-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BentoItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function BentoItem({ children, className }: BentoItemProps) {
  return <div className={cn("xl:col-span-4", className)}>{children}</div>;
}

