import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "i.picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "*.userapi.com", pathname: "/**" },
      { protocol: "https", hostname: "*.userapi.ru", pathname: "/**" },
      { protocol: "https", hostname: "vk.com", pathname: "/**" },
      { protocol: "https", hostname: "*.vk.com", pathname: "/**" },
      { protocol: "https", hostname: "vkvideo.ru", pathname: "/**" },
      { protocol: "https", hostname: "*.vkvideo.ru", pathname: "/**" },
      { protocol: "https", hostname: "*.mycdn.me", pathname: "/**" },
    ],
  },
};

export default nextConfig;
