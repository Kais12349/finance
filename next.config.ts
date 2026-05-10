import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.*.*", "10.*.*.*", "172.*.*.*"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
