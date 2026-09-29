import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/page-metadata';

/**
 * Chặn crawl vùng cá nhân/giao dịch/tiện ích. Các trang này cũng tự khai `noindex`
 * (`NOINDEX_ROBOTS`) phòng trường hợp bị link từ nơi khác.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
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
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
