import type { ProductDetailDto } from '@/generated/api/catalog/catalog.schemas';
import { siteUrl } from '@/shared/constants';

/**
 * Dữ liệu có cấu trúc gửi cho công cụ tìm kiếm phải đúng sự thật. Bản trước khai cứng
 * `aggregateRating` 4.9 với 128 đánh giá, luôn báo còn hàng và bịa giá 1.890.000 khi sản
 * phẩm chưa có bảng giá — không trường nào trong số đó có nguồn dữ liệu.
 */
export function buildProductJsonLd(
  product: ProductDetailDto,
  brand: string | null,
  hasPrice: boolean,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl,
    description: product.shortDescription,
    sku: product.productNo || product.slug,
    // Chưa có hãng thật thì không khai `brand`: gán tên cửa hàng làm hãng là sai dữ liệu có cấu trúc.
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    // Chưa có giá thì không khai `offers`: khai giá 0 hoặc giá bịa đều sai lệch kết quả
    // tìm kiếm. Điểm đánh giá và tồn kho hiện chưa có trong contract nên không khai.
    ...(hasPrice
      ? {
          offers: {
            '@type': 'Offer',
            url: siteUrl(`/products/${product.slug}`),
            priceCurrency: product.currency,
            price: product.minPrice,
            itemCondition: 'https://schema.org/NewCondition',
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(product: ProductDetailDto) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: siteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: siteUrl('/products'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: siteUrl(`/products/${product.slug}`),
      },
    ],
  };
}
