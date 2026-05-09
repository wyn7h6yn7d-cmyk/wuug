import { cn } from "@/lib/utils";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const variantStyles: Record<NonNullable<GradientButtonProps["variant"]>, string> = {
  primary:
    "text-white shadow-[0_18px_40px_rgba(99,102,241,0.32)] gradient-sheen hover:opacity-95",
  secondary:
    "text-fg bg-surface/80 dark:bg-surface/70 border border-token-soft shadow-[0_14px_34px_rgba(15,23,42,0.08)] hover:bg-surface dark:shadow-[0_14px_34px_rgba(0,0,0,0.45)]",
  ghost: "text-fg-muted hover:bg-surface/70 border border-transparent",
};

const sizeStyles: Record<NonNullable<GradientButtonProps["size"]>, string> = {
  sm: "h-9 rounded-2xl px-3 text-sm",
  md: "h-11 rounded-[22px] px-4 text-sm",
};

export function GradientButton({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: GradientButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        sizeStyles[size],
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
