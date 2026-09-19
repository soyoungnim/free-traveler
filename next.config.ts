import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // src/data/**의 여행지·대표 프로필 이미지가 참조하는 일반 인터넷 URL
    // 출처(PROJECT_SCOPE.md "이미지" 방식: 일반 URL + alt만 관리).
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;
