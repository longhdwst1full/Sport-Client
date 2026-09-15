import type { ProductDetailDto, ProductSummaryDto } from '@/generated/api/catalog/models';
import { vndMoney } from '@/shared/format/money';

export interface BundleComponentView {
  componentVariantId: string;
  componentSku: string;
  componentName: string;
  quantity: number;
}

export interface ProductVariantOptionView {
  id: string;
  sku: string;
  name: string;
  /** Null khi biến thể chưa có giá hiệu lực; không dựng ra số 0 gây hiểu nhầm. */
  priceAmount: number | null;
  priceLabel: string;
  sellable: boolean;
  /** Rỗng với hàng thường; combo mới có danh sách linh kiện. */
  bundleComponents: BundleComponentView[];
}

export interface ProductPurchaseView {
  id: string;
  name: string;
  imageUrl: string | null;
  productTypeCode: 'STANDARD' | 'BUNDLE';
  isBundle: boolean;
  variants: ProductVariantOptionView[];
}

/**
 * Nguồn duy nhất đọc tên trường của `ProductDetailDto` cho luồng mua hàng.
 * Giá hiển thị và giá đưa vào giỏ lấy từ cùng một chỗ, tránh lệch nhau.
 */
export function toProductPurchaseView(dto: ProductDetailDto): ProductPurchaseView {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: dto.imageUrl ?? null,
    productTypeCode: dto.productType === 'BUNDLE' ? 'BUNDLE' : 'STANDARD',
    isBundle: dto.productType === 'BUNDLE',
    variants: (dto.variants ?? []).map((variant) => {
      const amount =
        variant.effectivePrice === null || variant.effectivePrice === undefined
          ? null
          : Number(variant.effectivePrice);
      return {
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        priceAmount: amount,
        priceLabel: amount === null ? 'Liên hệ' : vndMoney.format(amount),
        sellable: amount !== null,
        bundleComponents: (variant.bundle?.components ?? []).map((component) => ({
          componentVariantId: component.componentVariantId,
          componentSku: component.componentSku,
          componentName: component.componentName,
          quantity: component.quantity,
        })),
      };
    }),
  };
}

export interface ProductSuggestionView {
  id: string;
  slug: string;
  name: string;
  categoryLabel: string;
  imageUrl: string | null;
  /** Giá đã format; 'Liên hệ tư vấn' khi chưa có bảng giá hiệu lực, không phải 0 đồng. */
  priceLabel: string;
}

export function toProductSuggestionView(dto: ProductSummaryDto): ProductSuggestionView {
  const hasPrice = dto.minPrice !== null && dto.minPrice !== undefined;
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    categoryLabel: dto.primaryCategory ?? 'Thiết bị thể thao',
    imageUrl: dto.imageUrl ?? null,
    priceLabel: hasPrice ? vndMoney.format(Number(dto.minPrice)) : 'Liên hệ tư vấn',
  };
}
