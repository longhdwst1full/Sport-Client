import type {
  ProductDetailDto,
  ProductListResponseDto,
  ProductSummaryDto,
} from '@/generated/api/catalog/models';
import { ProductMediaStatus, ProductVariantStatus } from '@/generated/api/catalog/models';
import { vndMoney } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';

/**
 * Số sản phẩm mỗi trang khi gọi `listCatalogProducts`.
 *
 * CONTRACT: API từ chối `limit > 100` bằng HTTP 400, nên mọi lưới phải phân trang theo `page`
 * thay vì nới `limit`. Đặt ở model (không có `'use client'`) để server component trang chủ
 * lấy trước đúng trang đầu mà hook client sẽ dùng.
 */
export const CATALOG_PAGE_SIZE = { SHOWCASE: 8, SCOPED: 24, MAX: 100 } as const;

/**
 * Giá tối thiểu có bán được không. Null/rỗng/0 đều là "chưa có bảng giá hiệu lực":
 * đưa 0 đồng vào giỏ là tạo ra một dòng hàng mà checkout sẽ báo giá khác hẳn.
 */
export function hasOfferPrice(amount: string | number | null | undefined): boolean {
  if (amount === null || amount === undefined || amount === '') return false;
  const value = Number(amount);
  return Number.isFinite(value) && value > 0;
}

export interface BundleComponentView {
  componentVariantId: string;
  componentSku: string;
  componentName: string;
  quantity: number;
}

/**
 * Thương hiệu hiển thị được hay không. 'OEM' là giá trị lấp chỗ khi DB chưa có hãng thật,
 * nên coi như không có thương hiệu; không thay bằng tên cửa hàng vì đó là khai sai hãng.
 */
export function toDisplayBrand(brand: string | null | undefined): string | null {
  const value = brand?.trim();
  if (!value || value.toUpperCase() === 'OEM') return null;
  return value;
}

export interface ProductVariantOptionView {
  id: string;
  sku: string;
  name: string;
  /** Null khi biến thể chưa có giá hiệu lực; không dựng ra số 0 gây hiểu nhầm. */
  priceAmount: number | null;
  priceLabel: string;
  sellable: boolean;
  /**
   * Còn hàng ở một kho chi nhánh (API `inStock`); null khi API không trả. Không chặn mua:
   * checkout tự chuyển đơn thiếu hàng sang chờ tư vấn, nên ở đây chỉ để báo trước cho khách.
   */
  inStock: boolean | null;
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
      const amount = hasOfferPrice(variant.effectivePrice) ? Number(variant.effectivePrice) : null;
      return {
        id: variant.id,
        sku: variant.sku,
        name: variant.name,
        priceAmount: amount,
        priceLabel: amount === null ? 'Liên hệ' : vndMoney.format(amount),
        // INVARIANT: chỉ biến thể ACTIVE có giá hiệu lực mới được thêm vào giỏ.
        sellable: amount !== null && variant.status === ProductVariantStatus.ACTIVE,
        inStock: variant.inStock ?? null,
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
  const hasPrice = hasOfferPrice(dto.minPrice);
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    categoryLabel: dto.primaryCategory ?? 'Thiết bị thể thao',
    imageUrl: dto.imageUrl ?? null,
    priceLabel: hasPrice ? vndMoney.format(Number(dto.minPrice)) : 'Liên hệ tư vấn',
  };
}

export interface ProductShowcaseItem {
  id: string;
  defaultVariantId: string | null;
  defaultVariantSku: string | null;
  slug: string;
  productType: string;
  name: string;
  /** Null khi chưa có hãng thật (kể cả 'OEM'); component bỏ trống thay vì điền tên cửa hàng. */
  brand: string | null;
  category: string;
  badge: string;
  imageUrl: string;
  /** Chỉ có nghĩa khi `hasPrice`; không dùng để so sánh/sắp xếp khi chưa có giá. */
  numericPrice: number;
  displayPrice: string;
  /** Chưa có bảng giá hiệu lực thì không bán được: giá 0 không phải là giá. */
  hasPrice: boolean;
  /** Mua nhanh được từ lưới: có giá và có SKU mặc định do API chỉ định. */
  isSellable: boolean;
  /** Xem `ProductVariantOptionView.inStock`: chỉ để gắn nhãn, không chặn mua. */
  inStock: boolean | null;
  shortDescription: string | null;
}

export function toProductShowcaseItem(product: ProductSummaryDto): ProductShowcaseItem {
  const hasPrice = hasOfferPrice(product.minPrice);
  const numericPrice = hasPrice ? Number(product.minPrice) : 0;
  const defaultVariantId = product.defaultVariantId ?? null;
  const defaultVariantSku = product.defaultVariantSku ?? null;
  return {
    id: product.id,
    defaultVariantId,
    defaultVariantSku,
    slug: product.slug,
    productType: product.productType,
    name: product.name,
    brand: toDisplayBrand(product.brand),
    category: product.primaryCategory ?? 'Thiết bị thể thao',
    badge: product.primaryCategory ?? 'Sản phẩm',
    // Ảnh thay thế trung tính của chính dự án. Trước đây dùng '/icon.svg' là logo
    // ứng dụng, nên lưới sản phẩm thiếu ảnh trông như lỗi hiển thị.
    imageUrl: product.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE,
    numericPrice,
    hasPrice,
    // Giá null nghĩa là chưa có bảng giá hiệu lực, không phải giá 0.
    displayPrice: hasPrice ? vndMoney.format(numericPrice) : 'Liên hệ tư vấn',
    // INVARIANT: nguồn duy nhất quyết định lưới được mua nhanh hay phải mở chi tiết.
    isSellable: hasPrice && Boolean(defaultVariantId && defaultVariantSku),
    inStock: product.inStock ?? null,
    shortDescription: product.shortDescription?.trim() || null,
  };
}

/** Gộp các trang đã tải, bỏ trùng theo id vì phân trang offset có thể lệch khi dữ liệu đổi. */
export function toProductShowcaseItems(pages: ProductListResponseDto[]): ProductShowcaseItem[] {
  const seen = new Set<string>();
  const items: ProductShowcaseItem[] = [];
  for (const page of pages) {
    for (const product of page.items) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      items.push(toProductShowcaseItem(product));
    }
  }
  return items;
}

export interface ProductGalleryImageView {
  id: string;
  url: string;
  alt: string;
}

/**
 * Ảnh trang chi tiết: media ACTIVE, ảnh chính lên đầu rồi theo `sortOrder` Admin sắp.
 * Không có media thì dùng `imageUrl`, cuối cùng là ảnh thay thế của dự án — không mượn
 * ảnh stock bên ngoài vì khách sẽ tưởng đó là ảnh thật của sản phẩm.
 */
export function toProductGalleryView(dto: ProductDetailDto): ProductGalleryImageView[] {
  const media = (dto.media ?? [])
    .filter((item) => item.status === ProductMediaStatus.ACTIVE && item.secureUrl)
    .sort((left, right) =>
      left.isPrimary === right.isPrimary
        ? left.sortOrder - right.sortOrder
        : left.isPrimary
          ? -1
          : 1,
    );
  const seen = new Set<string>();
  const images: ProductGalleryImageView[] = [];
  for (const item of media) {
    if (seen.has(item.secureUrl)) continue;
    seen.add(item.secureUrl);
    images.push({ id: item.id, url: item.secureUrl, alt: item.altText || dto.name });
  }
  if (images.length > 0) return images;
  return [{ id: 'primary', url: dto.imageUrl ?? PRODUCT_PLACEHOLDER_IMAGE, alt: dto.name }];
}
