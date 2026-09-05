import type { MetadataRoute } from 'next';

const BASE_URL = 'https://dctdsport.vn';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/category`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = [
    'gian-ta-da-nang-olympic-pro',
    'bo-ta-tay-thao-lap-cao-cap-20kg',
    'may-chay-bo-dien-gia-dinh-king-pro',
    'ghe-tap-ta-dieu-chinh-7-goc-do',
    'xe-dap-tap-the-thao-khang-luc-tu',
    'tham-tap-yoga-dinh-tuyen-tpe-8mm',
    'con-lan-foam-roller-mat-xa-co',
    'bao-cat-dam-boc-boxing-da-bo',
  ].map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = [
    'gym-fitness',
    'chay-bo-cardio',
    'bong-da',
    'yoga-phuc-hoi',
    'xe-dap-the-thao',
    'vo-thuat-boxing',
  ].map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const newsRoutes: MetadataRoute.Sitemap = [
    'huong-dan-chon-ta-tay-home-gym',
    '5-sai-lam-khi-chay-bo-tren-may',
    'setup-goc-tap-15m2-hoan-hao',
    'phuc-hoi-co-bap-sau-buoi-tap-nang',
  ].map((slug) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...newsRoutes];
}
