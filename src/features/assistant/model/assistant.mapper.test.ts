import { describe, expect, it } from 'vitest';
import type { ChatCardDto, ChatMessageDto } from '@/generated/api/assistant/assistant.schemas';
import { toAssistantMessageView } from './assistant.mapper';

function message(overrides: Partial<ChatMessageDto> = {}): ChatMessageDto {
  return {
    id: '10',
    role: 'ASSISTANT',
    content: 'nội dung',
    sources: [],
    cards: [],
    feedback: null,
    createdAt: '2026-09-29T00:00:00.000Z',
    ...overrides,
  } as ChatMessageDto;
}

type VariantInput = { variantId?: string; sku: string; effectivePrice: string | null; inStock: boolean | null };

const productCard = (
  over: {
    inStock?: boolean | null;
    variants?: VariantInput[];
    price?: string | null;
    variantId?: string | null;
    productType?: 'STANDARD' | 'BUNDLE';
  } = {},
): ChatCardDto => ({
  type: 'PRODUCT',
  product: {
    productId: '7',
    productType: over.productType ?? 'STANDARD',
    variantId: over.variantId === undefined ? '71' : over.variantId,
    slug: 'vot-a',
    name: 'Vợt A',
    brand: 'Yonex',
    imageUrl: null,
    price: over.price === undefined ? '1500000' : over.price,
    inStock: over.inStock === undefined ? true : over.inStock,
    variants: (over.variants ?? [{ variantId: '71', sku: 'SKU1', effectivePrice: '1500000', inStock: true }]).map((v, i) => ({
      name: v.sku,
      ...v,
      variantId: v.variantId ?? String(71 + i),
    })),
  },
});

describe('toAssistantMessageView', () => {
  it('map thẻ PRODUCT với productId, giá số và thêm nhanh theo biến thể mặc định còn hàng', () => {
    const [card] = toAssistantMessageView(message({ cards: [productCard()] })).cards;
    expect(card).toMatchObject({
      kind: 'product',
      productId: '7',
      slug: 'vot-a',
      price: 1500000,
      inStock: true,
      quickAdd: { variantId: '71', sku: 'SKU1', variantName: 'SKU1', price: 1500000 },
    });
  });

  it('giữ productType của thẻ (combo BUNDLE)', () => {
    const [card] = toAssistantMessageView(message({ cards: [productCard({ productType: 'BUNDLE' })] })).cards;
    expect(card).toMatchObject({ kind: 'product', productType: 'BUNDLE' });
  });

  it('nhiều biến thể vẫn thêm nhanh đúng biến thể mặc định do API chỉ định', () => {
    const [card] = toAssistantMessageView(
      message({
        cards: [
          productCard({
            variantId: '82',
            variants: [
              { variantId: '81', sku: 'A', effectivePrice: '100', inStock: true },
              { variantId: '82', sku: 'B', effectivePrice: '200', inStock: true },
            ],
          }),
        ],
      }),
    ).cards;
    expect((card as { quickAdd: unknown }).quickAdd).toEqual({ variantId: '82', sku: 'B', variantName: 'B', price: 200 });
  });

  it('giá rỗng/0/null là null, không bao giờ 0', () => {
    const [card] = toAssistantMessageView(
      message({ cards: [productCard({ price: '0', variants: [{ sku: 'S', effectivePrice: '', inStock: true }] })] }),
    ).cards;
    expect(card).toMatchObject({ price: null, quickAdd: null });
    expect((card as { variants: { price: number | null }[] }).variants[0].price).toBeNull();
  });

  it.each([
    ['sản phẩm hết hàng', productCard({ inStock: false })],
    ['biến thể mặc định hết hàng', productCard({ variants: [{ variantId: '71', sku: 'A', effectivePrice: '1', inStock: false }] })],
    ['tồn kho không rõ (null) không cho thêm', productCard({ inStock: null, variants: [{ variantId: '71', sku: 'A', effectivePrice: '1', inStock: null }] })],
    ['không có giá', productCard({ variants: [{ variantId: '71', sku: 'A', effectivePrice: null, inStock: true }] })],
    ['API không chỉ định biến thể mặc định', productCard({ variantId: null })],
    ['biến thể mặc định không có trong danh sách', productCard({ variantId: '999' })],
  ])('không thêm nhanh khi %s', (_name, card) => {
    const [view] = toAssistantMessageView(message({ cards: [card] })).cards;
    expect((view as { quickAdd: unknown }).quickAdd).toBeNull();
  });

  it('tồn kho chỉ là true/false/null, không bao giờ có số lượng', () => {
    const dto = productCard({ inStock: null, variants: [{ variantId: '71', sku: 'A', effectivePrice: '1', inStock: false }] });
    // Kể cả khi API lỡ trả thêm số lượng, view model không mang nó.
    (dto.product as unknown as Record<string, unknown>).stockQuantity = 42;
    (dto.product!.variants[0] as unknown as Record<string, unknown>).quantity = 7;
    const [card] = toAssistantMessageView(message({ cards: [dto] })).cards;
    expect(card).toMatchObject({ inStock: null });
    const serialized = JSON.stringify(card);
    expect(serialized).not.toMatch(/quantity|stockQuantity|42|"quantity":7/i);
    expect(Object.keys(card)).not.toContain('stockQuantity');
    for (const v of (card as { variants: { inStock: unknown }[] }).variants) {
      expect([true, false, null]).toContain(v.inStock);
      expect(Object.keys(v)).toEqual(['variantId', 'sku', 'name', 'price', 'inStock']);
    }
  });

  it('map thẻ ORDER với nhãn, tổng tiền và vận đơn', () => {
    const [card] = toAssistantMessageView(
      message({
        cards: [
          {
            type: 'ORDER',
            order: {
              orderNo: 'DH001',
              status: 'PLACED',
              paymentStatus: 'UNPAID',
              fulfillmentStatus: 'PENDING',
              grandTotal: '250000',
              currencyCode: 'VND',
              placedAt: '2026-09-28T00:00:00.000Z',
              carrierCode: 'GHN',
              trackingNo: 'TRK1',
            },
          } as ChatCardDto,
        ],
      }),
    ).cards;
    expect(card).toMatchObject({ kind: 'order', orderNo: 'DH001', grandTotal: 250000, shipmentLabel: 'GHN · TRK1' });
    const order = card as { statusLabel: string };
    expect(order.statusLabel).toEqual(expect.any(String));
  });

  it('thẻ ORDER: mã trạng thái lạ hiện mã thô, chưa có vận đơn thì shipmentLabel null', () => {
    const [card] = toAssistantMessageView(
      message({
        cards: [
          {
            type: 'ORDER',
            order: {
              orderNo: 'DH2',
              status: 'MA_LA',
              paymentStatus: 'MA_LA_2',
              fulfillmentStatus: 'MA_LA_3',
              grandTotal: '0',
              currencyCode: 'VND',
              placedAt: 'x',
              carrierCode: null,
              trackingNo: null,
            },
          } as ChatCardDto,
        ],
      }),
    ).cards;
    expect(card).toMatchObject({
      statusLabel: 'MA_LA',
      paymentStatusLabel: 'MA_LA_2',
      fulfillmentStatusLabel: 'MA_LA_3',
      grandTotal: null,
      shipmentLabel: null,
    });
  });

  it('map thẻ TICKET; trạng thái biết thì có status, lạ thì null và giữ statusCode', () => {
    const cards = toAssistantMessageView(
      message({
        cards: [
          { type: 'TICKET', ticket: { id: '1', ticketNo: 'T1', status: 'OPEN' } },
          { type: 'TICKET', ticket: { id: '2', ticketNo: 'T2', status: 'WEIRD' } },
        ],
      }),
    ).cards;
    expect(cards[0]).toEqual({ kind: 'ticket', ticketNo: 'T1', status: 'OPEN', statusCode: 'OPEN' });
    expect(cards[1]).toEqual({ kind: 'ticket', ticketNo: 'T2', status: null, statusCode: 'WEIRD' });
  });

  it('bỏ thẻ thiếu payload tương ứng', () => {
    const view = toAssistantMessageView(
      message({ cards: [{ type: 'PRODUCT' }, { type: 'ORDER' }, { type: 'TICKET' }] as ChatCardDto[] }),
    );
    expect(view.cards).toEqual([]);
  });

  it('khử trùng nguồn theo documentId, giữ thứ tự lần đầu', () => {
    const src = (documentId: string, title: string, chunkOrdinal: number) => ({ documentId, documentVersion: 1, chunkOrdinal, title });
    const view = toAssistantMessageView(
      message({ sources: [src('5', 'Đổi trả', 0), src('6', 'Vận chuyển', 0), src('5', 'Đổi trả', 3)] }),
    );
    expect(view.sources).toEqual([
      { key: '5', title: 'Đổi trả' },
      { key: '6', title: 'Vận chuyển' },
    ]);
  });
});
