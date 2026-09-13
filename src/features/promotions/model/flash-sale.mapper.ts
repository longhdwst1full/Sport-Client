import type {
  FlashSaleItemDto,
  PublicFlashSaleCampaignDto,
} from '@/generated/api/promotions/models';

export interface FlashSaleDealView {
  id: string;
  variantId: string;
  sku: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  /** Số nguyên đồng, đã parse từ Decimal chuỗi của server để format hiển thị. */
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  soldQuantity: number;
  availableQuantity: number;
  /** Phần trăm đã bán, dùng cho thanh tiến trình. */
  soldPercent: number;
  perCustomerLimit: number | null;
}

export interface FlashSaleCampaignView {
  code: string;
  name: string;
  description: string | null;
  /** Mốc kết thúc theo giờ server, dạng epoch ms. */
  endsAtMs: number;
  deals: FlashSaleDealView[];
}

function toAmount(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function toFlashSaleDealView(dto: FlashSaleItemDto): FlashSaleDealView {
  const price = toAmount(dto.salePrice) ?? 0;
  const originalPrice = toAmount(dto.regularPrice);
  return {
    id: dto.id,
    variantId: dto.productVariantId,
    sku: dto.sku,
    name: dto.productName,
    slug: dto.productSlug,
    imageUrl: dto.imageUrl ?? null,
    price,
    originalPrice,
    discountPercent:
      originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : null,
    soldQuantity: dto.soldQuantity,
    availableQuantity: dto.availableQuantity,
    soldPercent: dto.quota > 0 ? Math.min(Math.round((dto.soldQuantity / dto.quota) * 100), 100) : 0,
    perCustomerLimit: dto.perCustomerLimit ?? null,
  };
}

export function toFlashSaleCampaignView(dto: PublicFlashSaleCampaignDto): FlashSaleCampaignView {
  return {
    code: dto.code,
    name: dto.name,
    description: dto.description ?? null,
    endsAtMs: new Date(dto.endsAt).getTime(),
    deals: dto.items.map(toFlashSaleDealView),
  };
}
