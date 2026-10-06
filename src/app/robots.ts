import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/page-metadata';

/**
 * Chặn crawl vùng cá nhân/giao dịch/tiện ích. Các trang này cũng tự khai `noindex`
 * (`NOINDEX_ROBOTS`) phòng trường hợp bị link từ nơi khác.
 *
 * Không chặn `/_next/` hay ảnh: Google cần JS/CSS/ảnh để render và đánh giá trang.
 */
const DISALLOW_PATHS = [
  '/api/',
  '/cart',
  '/checkout',
  '/profile',
  '/account',
  '/orders',
  '/returns',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/offline',
  '/pwa',
  // Kết quả tìm kiếm nội bộ: nội dung mỏng, vô hạn biến thể theo từ khoá (trang đã `noindex`).
  '/search',
  // Biến thể lọc/sắp xếp/tìm của danh sách: canonical đã gom về URL gốc, chặn để khỏi tốn crawl budget.
  '/*?*q=',
  '/*?*sort=',
  '/*?*minPrice=',
  '/*?*maxPrice=',
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOW_PATHS],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
