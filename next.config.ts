import type { NextConfig } from 'next';

/**
 * SECURITY: CSP chạy ở chế độ Report-Only — chỉ báo vi phạm trong console, KHÔNG chặn. Theo dõi
 * vi phạm một thời gian rồi mới đổi key sang `Content-Security-Policy` để enforce.
 * `'unsafe-inline'` ở script/style là bắt buộc vì Next inline script hydrate và style; muốn bỏ phải
 * dùng nonce (middleware), nên để dành bước sau.
 */
const IMAGE_HOSTS = [
  'https://res.cloudinary.com',
  'https://images.unsplash.com',
  'https://baoansport.vn',
  'https://www.baoansport.vn',
];
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${IMAGE_HOSTS.join(' ')}`,
  "font-src 'self' data:",
  // Trình duyệt gọi API cùng origin qua rewrite /api/v1.
  "connect-src 'self'",
  // Video YouTube trong mô tả sản phẩm (đã sanitize).
  'frame-src https://www.youtube.com https://www.youtube-nocookie.com',
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

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
    /**
     * Ảnh có `sizes` cố định theo px (thẻ danh mục 112px, logo, mega menu) nhận srcset gồm MỌI
     * độ rộng `imageSizes + deviceSizes`; ~60 thẻ như vậy trên `/` làm HTML phình. Bỏ các mốc
     * layout không dùng: không `sizes` nào dưới 48px (bỏ 16/32/64) và 750 nằm sát 828. Mốc lớn nhất
     * giữ nguyên nên trình duyệt (luôn chọn mốc nhỏ nhất ≥ nhu cầu) không bao giờ nhận ảnh kém nét hơn.
     */
    imageSizes: [48, 96, 128, 256, 384],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 3840],
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
        // SECURITY: header bảo mật cho mọi route. VNPay là redirect top-level (window.location.assign)
        // nên không cần mở connect-src/form-action cho domain cổng thanh toán.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // geolocation=(self): checkout dùng navigator.geolocation để lấy vị trí giao hàng.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          // Không preload: preload khó gỡ, cân nhắc sau khi chắc chắn mọi subdomain đều HTTPS.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicyReportOnly },
        ],
      },
      {
        // Worker và file luật phải luôn lấy bản mới để bản sửa lỗi cache tới tay người dùng ngay.
        source: '/:file(sw.js|sw-routing.js)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        // SEO: `/pwa`, `/offline` là trang 'use client' nên không khai được `metadata.robots`; route
        // handler `/api/*` không có HTML. Header thay cho thẻ meta noindex (robots.ts chỉ chặn crawl,
        // URL bị link từ ngoài vẫn có thể vào index nếu thiếu noindex).
        source: '/:page(pwa|offline)',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
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
