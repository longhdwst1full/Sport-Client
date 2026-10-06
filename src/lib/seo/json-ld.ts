import { absoluteUrl, SITE_URL } from './page-metadata';

/**
 * SECURITY: `JSON.stringify` không escape `<`; tên/mô tả chứa `</script>` sẽ đóng thẻ
 * `<script type="application/ld+json">` sớm và chèn được script khác. Escape thành `<`
 * (khuyến nghị của Next.js) — JSON vẫn hợp lệ. Mọi JSON-LD nhúng vào trang phải đi qua hàm này.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

const SCHEMA_CONTEXT = 'https://schema.org';

/** `@id` cố định của Organization/WebSite khai ở root layout; trang con tham chiếu thay vì khai lại. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/*
 * Các builder dưới đây nhận view model trung lập (không nhận DTO generated): feature tự map DTO
 * sang input rồi gọi. Trường nào không có dữ liệu thật thì bỏ hẳn, không khai giá trị mặc định —
 * dữ liệu có cấu trúc sai bị Google phạt rich result.
 */

export interface BreadcrumbJsonLdItem {
  name: string;
  /** Đường dẫn tương đối hoặc URL tuyệt đối. Bỏ trống cho mục cuối (trang hiện tại) cũng hợp lệ. */
  path?: string;
}

export function buildBreadcrumbListJsonLd(items: readonly BreadcrumbJsonLdItem[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  };
}

export interface ProductJsonLdInput {
  name: string;
  /** Đường dẫn trang sản phẩm, ví dụ `/products/abc`. */
  path: string;
  images?: readonly (string | null | undefined)[];
  description?: string | null;
  sku?: string | null;
  brand?: string | null;
  /** Giá thấp nhất (VND) dạng số hoặc chuỗi số từ API; null/0/không hợp lệ thì không khai `offers`. */
  price?: string | number | null;
  /** Mã tiền tệ ISO 4217; mặc định VND. */
  priceCurrency?: string;
  /** `undefined` = API không báo tồn kho → không khai `availability`. */
  inStock?: boolean;
  /** Chỉ khai khi có ít nhất một đánh giá thật. */
  rating?: { value: number; count: number } | null;
}

/** Chuẩn hoá giá về chuỗi số không định dạng (schema.org không nhận dấu phân cách nghìn). */
function toSchemaPrice(price: ProductJsonLdInput['price']): string | undefined {
  if (price === null || price === undefined || price === '') return undefined;
  const value = typeof price === 'number' ? price : Number(price);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return String(Math.round(value * 100) / 100);
}

export function buildProductJsonLd(input: ProductJsonLdInput) {
  const url = absoluteUrl(input.path);
  const images = (input.images ?? []).filter((image): image is string => Boolean(image)).map(absoluteUrl);
  const price = toSchemaPrice(input.price);
  const rating = input.rating && input.rating.count > 0 && input.rating.value > 0 ? input.rating : undefined;

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    name: input.name,
    url,
    ...(images.length ? { image: images } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.brand ? { brand: { '@type': 'Brand', name: input.brand } } : {}),
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price,
            priceCurrency: input.priceCurrency ?? 'VND',
            itemCondition: 'https://schema.org/NewCondition',
            ...(input.inStock === undefined
              ? {}
              : { availability: input.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }),
            seller: { '@id': ORGANIZATION_ID },
          },
        }
      : {}),
    ...(rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.round(rating.value * 10) / 10,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export interface ArticleJsonLdInput {
  headline: string;
  path: string;
  description?: string | null;
  images?: readonly (string | null | undefined)[];
  /** ISO 8601. */
  datePublished?: string | null;
  dateModified?: string | null;
  /** Bỏ trống thì tác giả là chính cửa hàng (Organization). */
  authorName?: string | null;
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const url = absoluteUrl(input.path);
  const images = (input.images ?? []).filter((image): image is string => Boolean(image)).map(absoluteUrl);
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    // Google cắt headline quá 110 ký tự.
    headline: input.headline.slice(0, 110),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'vi-VN',
    ...(input.description ? { description: input.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified || input.datePublished
      ? { dateModified: input.dateModified ?? input.datePublished }
      : {}),
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
  };
}
