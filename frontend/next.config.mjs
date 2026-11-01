/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forward the browser's same-origin API requests to the existing API service.
  async rewrites() {
    const apiUrl = (process.env.API_URL || "http://localhost:8080/api").replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
};
export default nextConfig;

