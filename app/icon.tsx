import { ImageResponse } from "next/og";
import { BrandMarkOg } from "@/lib/brand-mark-og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandMarkOg dimension={32} />, { ...size });
}
