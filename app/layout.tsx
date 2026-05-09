import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "@/components/providers/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wuug — the AI command center for team operations",
  description:
    "wuug shows what needs the next step before anything is forgotten. A living radar for clients, projects, tasks, and promises.",
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>{ThemeScript}</head>
      <body className="min-h-full bg-app text-fg">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
