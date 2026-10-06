import type { ProductDetailDto } from '@/generated/api/catalog/catalog.schemas';
import { ProductMediaStatus } from '@/generated/api/catalog/catalog.schemas';
import {
  buildBreadcrumbListJsonLd,
  buildProductJsonLd,
  type BreadcrumbJsonLdItem,
} from '@/lib/seo/json-ld';

/** Mô tả SEO dự phòng khi Admin chưa nhập mô tả ngắn: cụ thể theo sản phẩm, không văn mẫu chung. */
export function toProductSeoDescription(name: string, shortDescription?: string | null): string {
  const text = shortDescription?.trim();
  if (text) return text;
  return `Mua ${name} chính hãng tại Bảo An Sport. Giá tốt, bảo hành chính hãng, giao hàng và lắp đặt toàn quốc.`;
}

export function toCategorySeoDescription(name: string, description?: string | null): string {
  const text = description?.trim();
  if (text) return text;
  return `Mua ${name} chính hãng tại Bảo An Sport. Đa dạng mẫu mã, giá tốt, bảo hành chính hãng, giao hàng toàn quốc.`;
}

/**
 * Breadcrumb trang chi tiết dùng chung cho UI và JSON-LD để hai bản không lệch nhau.
 * Danh mục chính chỉ có link khi route tra được slug từ cây danh mục.
 */
export function toProductBreadcrumbItems(
  product: Pick<ProductDetailDto, 'name' | 'slug' | 'primaryCategory'>,
  categorySlug: string | undefined,
): Array<{ label: string; href?: string }> {
  return [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    ...(product.primaryCategory
      ? [{ label: product.primaryCategory, href: categorySlug ? `/category/${categorySlug}` : undefined }]
      : []),
    { label: product.name, href: `/products/${product.slug}` },
  ];
}

export function toBreadcrumbJsonLd(items: ReadonlyArray<{ label: string; href?: string }>) {
  return buildBreadcrumbListJsonLd(
    items.map((item): BreadcrumbJsonLdItem => ({ name: item.label, path: item.href })),
  );
}

/**
 * Dữ liệu có cấu trúc gửi cho công cụ tìm kiếm phải đúng sự thật: chỉ khai giá khi có biến thể
 * mở bán (`hasPrice`), tồn kho theo `inStock` của API, ảnh từ media ACTIVE thật (không dùng ảnh
 * thay thế của dự án). Chưa có điểm đánh giá trong contract chi tiết nên không khai `aggregateRating`.
 */
export function toProductJsonLd(product: ProductDetailDto, brand: string | null, hasPrice: boolean) {
  const images = (product.media ?? [])
    .filter((item) => item.status === ProductMediaStatus.ACTIVE && item.secureUrl)
    .sort((left, right) =>
      left.isPrimary === right.isPrimary ? left.sortOrder - right.sortOrder : left.isPrimary ? -1 : 1,
    )
    .map((item) => item.secureUrl);
  if (product.imageUrl && !images.includes(product.imageUrl)) images.push(product.imageUrl);

  return buildProductJsonLd({
    name: product.name,
    path: `/products/${product.slug}`,
    images,
    description: product.shortDescription,
    sku: product.productNo || product.slug,
    brand,
    price: hasPrice ? product.minPrice : null,
    priceCurrency: product.currency,
    inStock: product.inStock,
  });
}
