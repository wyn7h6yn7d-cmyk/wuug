import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      // Browsers often request /favicon.ico; send them to the generated app icon (PNG).
      { source: "/favicon.ico", destination: "/icon", permanent: false },
    ];
  },
};

export default nextConfig;
