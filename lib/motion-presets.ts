/** Shared spring feel for buttons and links — snappy, “alive” feedback */
export const BTN_SPRING = { type: "spring" as const, stiffness: 460, damping: 28, mass: 0.75 };

export const BTN_TAP = { scale: 0.94 };

export function btnHoverLift(variant: "primary" | "secondary" | "ghost") {
  if (variant === "ghost") return { scale: 1.04 };
  if (variant === "primary") return { y: -3, scale: 1.03 };
  return { y: -2, scale: 1.02 };
}
