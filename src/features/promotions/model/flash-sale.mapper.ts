import type {
  FlashSaleItemDto,
  PublicFlashSaleCampaignDto,
  PublicFlashSaleListDto,
} from '@/generated/api/promotions/promotions.schemas';
import { formatVnd } from '@/shared/format/money';

/** Danh sách chiến dịch server lấy sẵn (route) để truyền xuống khối/trang client. */
export type FlashSaleInitialData = PublicFlashSaleListDto;

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

/** Giá flash đang mở của một biến thể, cho trang chi tiết sản phẩm. */
export interface VariantFlashPriceView {
  price: number;
  priceLabel: string;
  originalPriceLabel: string | null;
  discountPercent: number | null;
  availableQuantity: number;
  /** Phần trăm suất đã bán (thanh tiến trình). */
  soldPercent: number;
  /** Mốc kết thúc theo giờ server (epoch ms); client ẩn giá flash khi đã qua. */
  endsAtMs: number;
}

/**
 * Giá flash theo `variantId`. Catalog chỉ trả giá niêm yết, còn checkout tự áp giá flash theo biến thể
 * (`resolveActiveDeals`), nên nơi hiển thị giá phải lấy giá flash từ đây mới khớp số tiền ở bước báo
 * giá. Bỏ suất đã hết; một biến thể ở nhiều chiến dịch thì lấy chiến dịch kết thúc sớm nhất (API đã
 * sắp theo `endsAt`). `productSlug` lọc riêng một sản phẩm (trang chi tiết).
 */
export function toVariantFlashPriceMap(
  campaigns: readonly FlashSaleCampaignView[],
  productSlug?: string,
): Record<string, VariantFlashPriceView> {
  const result: Record<string, VariantFlashPriceView> = {};
  for (const campaign of campaigns) {
    for (const deal of campaign.deals) {
      if (productSlug && deal.slug !== productSlug) continue;
      if (deal.availableQuantity <= 0 || result[deal.variantId]) continue;
      result[deal.variantId] = {
        price: deal.price,
        priceLabel: formatVnd(deal.price),
        originalPriceLabel: deal.originalPrice !== null ? formatVnd(deal.originalPrice) : null,
        discountPercent: deal.discountPercent,
        availableQuantity: deal.availableQuantity,
        soldPercent: deal.soldPercent,
        endsAtMs: campaign.endsAtMs,
      };
    }
  }
  return result;
}

/** Suất flash theo biến thể cho giỏ hàng: gồm cả suất đã hết (0) để giỏ biết dòng không còn giá flash. */
export interface VariantFlashQuotaView {
  price: number;
  regularPrice: number | null;
  maxQuantity: number;
  endsAtMs: number;
}

/** Giỏ/checkout dùng để tính lại dòng theo luật "vượt suất → cả dòng giá thường" của checkout. */
export function toVariantFlashQuotaMap(campaigns: readonly FlashSaleCampaignView[]): Record<string, VariantFlashQuotaView> {
  const result: Record<string, VariantFlashQuotaView> = {};
  for (const campaign of campaigns) {
    for (const deal of campaign.deals) {
      if (result[deal.variantId]) continue;
      result[deal.variantId] = {
        price: deal.price,
        regularPrice: deal.originalPrice,
        maxQuantity: Math.max(0, deal.availableQuantity),
        endsAtMs: campaign.endsAtMs,
      };
    }
  }
  return result;
}

/** Bản server (route trang chi tiết): từ DTO danh sách chiến dịch. */
export function toVariantFlashPrices(
  dto: PublicFlashSaleListDto | undefined,
  productSlug: string,
): Record<string, VariantFlashPriceView> {
  return toVariantFlashPriceMap((dto?.items ?? []).map(toFlashSaleCampaignView), productSlug);
}
