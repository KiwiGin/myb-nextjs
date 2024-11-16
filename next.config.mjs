/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "avatar.iran.liara.run",
      "placehold.co",
    ],
  },
};

export default nextConfig;
