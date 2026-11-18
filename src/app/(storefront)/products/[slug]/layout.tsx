import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ApiError } from '@/lib/api/fetcher';
import { loadCatalogProduct } from '../../_data/catalog-product';

/**
 * SEO: kiểm tra sản phẩm tồn tại Ở LAYOUT, trước ranh giới `loading.tsx` của page. Gọi `notFound()` trong
 * page (đã nằm trong Suspense của `loading.tsx`) thì HTTP status đã gửi đi là 200 — công cụ tìm kiếm thấy
 * "soft 404" cho slug không có thật. Ở đây thì status là 404 thật.
 * Chỉ chặn khi API trả 404; lỗi khác (mạng, 5xx) để page tự xử lý, không biến sự cố tạm thời thành 404.
 */
export default async function ProductSlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    await loadCatalogProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
  }
  return children;
}
