import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '127.0.0.1:3199', 'localhost:3199'],
  // Nén HTTP (gzip) do `next start` tự làm; trên Vercel CDN nén thay. Giữ mặc định `compress: true`.
  poweredByHeader: false,
  images: {
    /**
     * Ảnh catalog gốc (baoansport.vn) là JPEG 20–250 KB mỗi ảnh — 12 thẻ trang chủ ≈ 1,5 MB, trong
     * khi thẻ chỉ hiển thị ~300 px. Bật bộ tối ưu của Next để trả AVIF/WebP đúng kích thước theo
     * `sizes`. `NEXT_IMAGE_UNOPTIMIZED=true` (build-time) tắt lại nếu hạn mức Image Optimization của
     * nền tảng deploy không đủ.
     */
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
    formats: ['image/avif', 'image/webp'],
    // Ảnh sản phẩm/bài viết đổi URL khi đổi ảnh, nên giữ bản đã tối ưu lâu để không tối ưu lại.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Ảnh catalog seed từ baoansport.vn. Thiếu host ở đây thì next/image chặn
      // và toàn bộ ảnh sản phẩm không hiển thị.
      { protocol: 'https', hostname: 'baoansport.vn' },
      { protocol: 'https', hostname: 'www.baoansport.vn' },
    ],
  },
  async headers() {
    return [
      {
        // Worker và file luật phải luôn lấy bản mới để bản sửa lỗi cache tới tay người dùng ngay.
        source: '/:file(sw.js|sw-routing.js)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ];
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
