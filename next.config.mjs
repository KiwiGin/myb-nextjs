/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "avatar.iran.liara.run"],
  },
};

export default nextConfig;
