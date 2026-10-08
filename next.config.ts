import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * Demo files are versioned by name (achp-v1.mp4), so a new cut is a new
   * URL and the old one can be cached forever.
   */
  async headers() {
    return [
      {
        source: "/videos/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
