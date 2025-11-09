/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXTAUTH_URL ?? "http://localhost:3000"],
    },
    typedRoutes: true
  }
};

export default nextConfig;
