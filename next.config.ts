import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Ảnh catalog seed từ baoansport.vn. Thiếu host ở đây thì next/image chặn
      // và toàn bộ ảnh sản phẩm không hiển thị.
      { protocol: 'https', hostname: 'baoansport.vn' },
      { protocol: 'https', hostname: 'www.baoansport.vn' },
    ],
  },
};

export default nextConfig;
