import { describe, expect, it } from 'vitest';
import { toQuickAddCartItem } from './assistant-quick-add';
import type { AssistantProductCardView } from './assistant.types';

const card = (over: Partial<AssistantProductCardView> = {}): AssistantProductCardView => ({
  kind: 'product',
  productId: '7',
  productType: 'STANDARD',
  slug: 'vot-a',
  name: 'Vợt A',
  brand: null,
  imageUrl: 'https://res.cloudinary.com/x.jpg',
  price: 1500000,
  inStock: true,
  variants: [{ variantId: '71', sku: 'SKU1', name: 'Mặc định', price: 1500000, inStock: true }],
  quickAdd: { variantId: '71', sku: 'SKU1', variantName: 'Mặc định', price: 1500000 },
  ...over,
});

describe('toQuickAddCartItem', () => {
  it('dựng dòng giỏ từ productId/variantId của thẻ, số lượng 1', () => {
    expect(toQuickAddCartItem(card())).toEqual({
      productId: '7',
      variantId: '71',
      sku: 'SKU1',
      productType: 'STANDARD',
      name: 'Vợt A',
      slug: 'vot-a',
      imageUrl: 'https://res.cloudinary.com/x.jpg',
      price: 1500000,
      quantity: 1,
    });
  });

  it('dòng giỏ mang đúng productType của thẻ (combo)', () => {
    expect(toQuickAddCartItem(card({ productType: 'BUNDLE' }))?.productType).toBe('BUNDLE');
  });

  it('nhiều biến thể thì tên dòng giỏ kèm tên biến thể', () => {
    const item = toQuickAddCartItem(
      card({
        variants: [
          { variantId: '71', sku: 'A', name: 'Size S', price: 1, inStock: true },
          { variantId: '72', sku: 'B', name: 'Size M', price: 2, inStock: true },
        ],
        quickAdd: { variantId: '72', sku: 'B', variantName: 'Size M', price: 2 },
      }),
    );
    expect(item).toMatchObject({ variantId: '72', sku: 'B', name: 'Vợt A — Size M', price: 2 });
  });

  it('không có quickAdd (hết hàng/không rõ tồn/không giá) thì không thêm', () => {
    expect(toQuickAddCartItem(card({ quickAdd: null }))).toBeNull();
  });

  it('thiếu ảnh thì imageUrl undefined, không phải null', () => {
    expect(toQuickAddCartItem(card({ imageUrl: null }))?.imageUrl).toBeUndefined();
  });
});
