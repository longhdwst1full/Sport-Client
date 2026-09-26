import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '127.0.0.1:3199', 'localhost:3199'],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Ảnh catalog seed từ baoansport.vn. Thiếu host ở đây thì next/image chặn
      // và toàn bộ ảnh sản phẩm không hiển thị.
      { protocol: 'https', hostname: 'baoansport.vn' },
      { protocol: 'https', hostname: 'www.baoansport.vn' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'https://sport-api-doc.vercel.app'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
