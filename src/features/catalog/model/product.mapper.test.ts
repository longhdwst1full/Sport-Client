import { describe, expect, it } from 'vitest';
import type {
  ProductDetailDto,
  ProductListResponseDto,
  ProductSummaryDto,
  ProductVariantDto,
} from '@/generated/api/catalog/catalog.schemas';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';
import {
  hasOfferPrice,
  toProductGalleryView,
  toProductPurchaseView,
  toProductShowcaseItem,
  toProductShowcaseItems,
  toDisplayBrand,
} from './product.mapper';

const summary = (overrides: Partial<ProductSummaryDto> = {}): ProductSummaryDto => ({
  id: '1',
  defaultVariantId: '10',
  defaultVariantSku: 'SKU-10',
  productNo: 'P1',
  name: 'Máy chạy bộ',
  slug: 'may-chay-bo',
  productType: 'STANDARD',
  status: 'PUBLISHED',
  isPublished: true,
  version: 1,
  minPrice: '1500000.00',
  currency: 'VND',
  imageUrl: null,
  ...overrides,
});

const variant = (overrides: Partial<ProductVariantDto> = {}): ProductVariantDto => ({
  id: '10',
  sku: 'SKU-10',
  name: 'Mặc định',
  weightGrams: 0,
  status: 'ACTIVE',
  version: 1,
  effectivePrice: '1500000.00',
  ...overrides,
});

const detail = (overrides: Partial<ProductDetailDto> = {}): ProductDetailDto => ({
  ...summary(),
  specifications: [],
  variants: [variant()],
  media: [],
  categories: [],
  categoryIds: [],
  ...overrides,
});

describe('hasOfferPrice', () => {
  it('treats null, empty and zero as no price', () => {
    expect(hasOfferPrice(null)).toBe(false);
    expect(hasOfferPrice(undefined)).toBe(false);
    expect(hasOfferPrice('')).toBe(false);
    expect(hasOfferPrice('0.00')).toBe(false);
    expect(hasOfferPrice('1500000.00')).toBe(true);
  });
});

describe('toDisplayBrand', () => {
  it('hides the OEM placeholder and empty brands instead of substituting the store name', () => {
    expect(toDisplayBrand('OEM')).toBeNull();
    expect(toDisplayBrand(' oem ')).toBeNull();
    expect(toDisplayBrand('')).toBeNull();
    expect(toDisplayBrand(undefined)).toBeNull();
    expect(toDisplayBrand('Double Fish')).toBe('Double Fish');
    expect(toProductShowcaseItem(summary({ brand: 'OEM' })).brand).toBeNull();
  });
});

describe('toProductShowcaseItem', () => {
  it('is sellable only with a price and a default SKU', () => {
    expect(toProductShowcaseItem(summary()).isSellable).toBe(true);
    expect(toProductShowcaseItem(summary({ minPrice: null })).isSellable).toBe(false);
    expect(toProductShowcaseItem(summary({ minPrice: '0' })).isSellable).toBe(false);
    expect(toProductShowcaseItem(summary({ defaultVariantSku: null })).isSellable).toBe(false);
  });

  it('labels unpriced products instead of showing 0 đ and uses the placeholder image', () => {
    const item = toProductShowcaseItem(summary({ minPrice: null }));
    expect(item.hasPrice).toBe(false);
    expect(item.displayPrice).toBe('Liên hệ tư vấn');
    expect(item.imageUrl).toBe(PRODUCT_PLACEHOLDER_IMAGE);
  });
});

describe('toProductShowcaseItems', () => {
  it('flattens pages and drops duplicates shifted across page boundaries', () => {
    const page = (ids: string[]): ProductListResponseDto => ({
      items: ids.map((id) => summary({ id, slug: `p-${id}` })),
      meta: { page: 1, limit: 2, total: 3, totalPages: 2 },
    });
    const items = toProductShowcaseItems([page(['1', '2']), page(['2', '3'])]);
    expect(items.map(({ id }) => id)).toEqual(['1', '2', '3']);
  });
});

describe('toProductPurchaseView', () => {
  it('only marks ACTIVE priced variants as sellable', () => {
    const view = toProductPurchaseView(
      detail({
        variants: [
          variant({ id: '1' }),
          variant({ id: '2', effectivePrice: null }),
          variant({ id: '3', status: 'INACTIVE' }),
          variant({ id: '4', effectivePrice: '0' }),
        ],
      }),
    );
    expect(view.variants.map(({ sellable }) => sellable)).toEqual([true, false, false, false]);
    expect(view.variants[3].priceAmount).toBeNull();
  });
});

describe('toProductGalleryView', () => {
  const media = (id: string, sortOrder: number, isPrimary = false, status: 'ACTIVE' | 'INACTIVE' = 'ACTIVE') => ({
    id,
    mediaAssetId: id,
    secureUrl: `https://res.cloudinary.com/x/${id}.jpg`,
    altText: null,
    sortOrder,
    isPrimary,
    status,
  });

  it('puts the primary image first, keeps sort order and skips inactive media', () => {
    const gallery = toProductGalleryView(
      detail({ media: [media('a', 2), media('b', 1), media('c', 5, true), media('d', 0, false, 'INACTIVE')] }),
    );
    expect(gallery.map(({ id }) => id)).toEqual(['c', 'b', 'a']);
    expect(gallery[0].alt).toBe('Máy chạy bộ');
  });

  it('falls back to the project placeholder, never a stock photo', () => {
    expect(toProductGalleryView(detail())[0].url).toBe(PRODUCT_PLACEHOLDER_IMAGE);
  });
});
