/** Tag `unstable_cache` của dữ liệu công khai; tách riêng để route revalidate import không kéo theo SDK. */
export const PUBLIC_DATA_TAGS = {
  categories: 'public:catalog-categories',
  banners: 'public:content-banners',
} as const;
