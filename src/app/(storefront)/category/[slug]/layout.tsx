import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getPublicCategories } from '../../_data/public-data';

/**
 * SEO: kiểm tra danh mục tồn tại Ở LAYOUT, trước ranh giới `loading.tsx` của page, để slug sai trả HTTP 404
 * thật thay vì 200 (soft 404). Cây danh mục đi qua cache dùng chung nên không thêm lời gọi API.
 * API lỗi (`undefined`) thì không kết luận 404, để page tự xử lý.
 */
export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getPublicCategories();
  if (categories && !categories.some((item) => item.slug === slug)) notFound();
  return children;
}
