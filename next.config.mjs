/** @type {import('next').NextConfig} */
const nextConfig = {
  // Preserve the versioned API URLs while serving native Next.js handlers.
  async rewrites() {
    return { beforeFiles: [{ source: "/api/v1/:path*", destination: "/api/:path*" }] };
  },
};
export default nextConfig;

