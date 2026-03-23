import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "translate123.app" }],
      destination: "https://www.translate123.app/:path*",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        { key: "Service-Worker-Allowed", value: "/" },
        { key: "Cache-Control", value: "no-cache" },
      ],
    },
  ],
};

export default nextConfig;
