import { describe, expect, it } from 'vitest';
import type { FlashSaleItemDto, PublicFlashSaleListDto } from '@/generated/api/promotions/promotions.schemas';
import { toFlashSaleCampaignView, toVariantFlashPriceMap, toVariantFlashPrices } from './flash-sale.mapper';

function item(overrides: Partial<FlashSaleItemDto>): FlashSaleItemDto {
  return {
    id: '1',
    productVariantId: '10',
    sku: 'SKU-10',
    productName: 'Máy chạy bộ',
    productSlug: 'may-chay-bo',
    salePrice: '8000000',
    regularPrice: '10000000',
    quota: 10,
    soldQuantity: 2,
    availableQuantity: 8,
    status: 'ACTIVE',
    version: '1',
    ...overrides,
  };
}

function list(...campaigns: Array<{ endsAt: string; items: FlashSaleItemDto[] }>): PublicFlashSaleListDto {
  return {
    serverTime: '2026-10-17T00:00:00.000Z',
    items: campaigns.map((campaign, index) => ({
      code: `C${index}`,
      name: `Chiến dịch ${index}`,
      startsAt: '2026-10-16T00:00:00.000Z',
      ...campaign,
    })),
  };
}

describe('toVariantFlashPrices', () => {
  it('trả giá flash theo variantId của đúng sản phẩm, kèm giá gốc và % giảm', () => {
    const prices = toVariantFlashPrices(
      list({ endsAt: '2026-10-18T00:00:00.000Z', items: [item({}), item({ id: '2', productVariantId: '20', productSlug: 'khac' })] }),
      'may-chay-bo',
    );
    expect(Object.keys(prices)).toEqual(['10']);
    expect(prices['10']).toMatchObject({
      price: 8_000_000,
      discountPercent: 20,
      availableQuantity: 8,
      endsAtMs: Date.parse('2026-10-18T00:00:00.000Z'),
    });
    expect(prices['10'].originalPriceLabel).not.toBeNull();
  });

  it('bỏ suất đã hết và giữ chiến dịch kết thúc sớm nhất khi trùng biến thể', () => {
    const prices = toVariantFlashPrices(
      list(
        { endsAt: '2026-10-17T06:00:00.000Z', items: [item({ availableQuantity: 0 }), item({ id: '3', productVariantId: '30', salePrice: '7000000' })] },
        { endsAt: '2026-10-18T00:00:00.000Z', items: [item({ id: '4', salePrice: '9000000' }), item({ id: '5', productVariantId: '30', salePrice: '6000000' })] },
      ),
      'may-chay-bo',
    );
    expect(prices['10'].price).toBe(9_000_000);
    expect(prices['30'].price).toBe(7_000_000);
  });

  it('không có dữ liệu → rỗng', () => {
    expect(toVariantFlashPrices(undefined, 'may-chay-bo')).toEqual({});
  });
});

describe('toVariantFlashPriceMap', () => {
  it('không truyền slug → gom mọi sản phẩm (cho thẻ sản phẩm ở lưới)', () => {
    const dto = list({
      endsAt: '2026-10-18T00:00:00.000Z',
      items: [item({}), item({ id: '2', productVariantId: '20', productSlug: 'khac', salePrice: '500000', regularPrice: null })],
    });
    const prices = toVariantFlashPriceMap(dto.items.map(toFlashSaleCampaignView));
    expect(Object.keys(prices).sort()).toEqual(['10', '20']);
    expect(prices['20']).toMatchObject({ price: 500_000, originalPriceLabel: null, discountPercent: null });
  });
});
