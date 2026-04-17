const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  /** Use this app directory as Turbopack root when multiple lockfiles exist in the monorepo. */
  turbopack: {
    root: path.join(__dirname),
  },
  /** Proxy API routes to the Bun + Hono backend (see /backend). */
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://127.0.0.1:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
