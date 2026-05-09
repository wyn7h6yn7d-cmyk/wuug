import { cn } from "@/lib/utils";

type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const variantStyles: Record<NonNullable<GradientButtonProps["variant"]>, string> = {
  primary:
    "text-white shadow-[0_18px_40px_rgba(99,102,241,0.28)] bg-[linear-gradient(90deg,rgba(99,102,241,1)_0%,rgba(168,85,247,1)_45%,rgba(20,184,166,1)_100%)] hover:opacity-95",
  secondary:
    "text-slate-800 bg-white/70 border border-white/70 shadow-[0_14px_34px_rgba(15,23,42,0.10)] hover:bg-white/85",
  ghost: "text-slate-700 hover:bg-white/55 border border-transparent",
};

const sizeStyles: Record<NonNullable<GradientButtonProps["size"]>, string> = {
  sm: "h-10 rounded-2xl px-3 text-sm",
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

