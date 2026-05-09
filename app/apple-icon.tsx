import { ImageResponse } from "next/og";
import { BrandMarkOg } from "@/lib/brand-mark-og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandMarkOg dimension={180} />, { ...size });
}
