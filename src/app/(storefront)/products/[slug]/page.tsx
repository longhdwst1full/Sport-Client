import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetailPage } from '@/features/catalog/pages/product-detail-page';
import { toProductSeoDescription } from '@/features/catalog';
import { getCatalogProduct, listCatalogCategories } from '@/generated/api/catalog/catalog';
import { ApiError } from '@/lib/api/fetcher';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { toOgImageUrl } from '@/lib/seo/og-image';

// ISR 2 phút: trang public đọc nhiều, giá ở đây chỉ để tham khảo vì bước báo giá checkout
// luôn tính lại. `revalidate = 0` trước đây bắt mọi lượt xem gọi API tới hai lần.
export const revalidate = 120;

// Không build trước slug nào; trả mảng rỗng để Next render lần đầu theo yêu cầu rồi cache theo
// `revalidate` (ISR). Thiếu hàm này route `[slug]` bị coi là dynamic và bỏ qua `revalidate`.
export function generateStaticParams() {
  return [];
}

// `generateMetadata` và page chạy trong cùng một request; `cache` gộp hai lượt gọi làm một.
const loadProduct = cache((slug: string) => getCatalogProduct(slug));

/**
 * `ProductDetailDto` chỉ có tên danh mục chính, trong khi lọc sản phẩm liên quan cần slug.
 * Tra theo tên trong cây danh mục; không khớp hoặc API lỗi thì trả undefined (liên quan chung).
 */
const loadCategories = cache(async () => {
  try {
    const { items } = await listCatalogCategories();
    return items;
  } catch {
    return undefined;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // CONTRACT: metadata đọc thẳng từ API. API lỗi thì trả metadata tối thiểu,
  // không dựng tên/mô tả/ảnh của một sản phẩm không tồn tại.
  let product: Awaited<ReturnType<typeof getCatalogProduct>> | undefined;
  try {
    product = await loadProduct(slug);
  } catch {
    return { title: 'Sản phẩm' };
  }

  // Không gắn "Trả Góp 0%" vào tiêu đề: contract không có gói trả góp theo sản phẩm.
  // Sản phẩm chưa có ảnh thì bỏ hẳn thẻ ảnh thay vì chèn ảnh của sản phẩm khác.
  return buildPageMetadata({
    title: product.name,
    description: toProductSeoDescription(product.name, product.shortDescription),
    path: `/products/${product.slug}`,
    images: product.imageUrl ? [toOgImageUrl(product.imageUrl)] : undefined,
  });
}

export default async function ProductDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Danh mục không phụ thuộc sản phẩm: tải song song thay vì chờ sản phẩm xong mới gọi.
  // `loadCategories` không bao giờ reject nên lỗi của `loadProduct` vẫn đi đúng nhánh dưới.
  const categoriesPromise = loadCategories();
  let product: Awaited<ReturnType<typeof getCatalogProduct>>;
  try {
    [product] = await Promise.all([loadProduct(slug), categoriesPromise]);
  } catch (error) {
    // Không còn fallback sang dữ liệu mẫu: hiển thị sản phẩm không tồn tại còn
    // tệ hơn báo lỗi, vì khách có thể đặt mua thứ cửa hàng không bán.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const primaryCategory = product.primaryCategory;
  const relatedCategorySlug = primaryCategory
    ? (await categoriesPromise)?.find((item) => item.name === primaryCategory)?.slug
    : undefined;

  return <ProductDetailPage product={product} slug={slug} relatedCategorySlug={relatedCategorySlug} />;
}
