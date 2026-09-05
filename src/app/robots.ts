import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/checkout', '/profile', '/login', '/register'],
      },
    ],
    sitemap: 'https://baoansport.vn/sitemap.xml',
  };
}
