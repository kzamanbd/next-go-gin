import path from "node:path";
import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // Self-contained server build for Docker (apps/web/Dockerfile).
  output: "standalone",
  // Trace from the monorepo root so workspace deps are bundled.
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Proxy /api/* to the Go (Gin) backend so the browser stays same-origin.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
