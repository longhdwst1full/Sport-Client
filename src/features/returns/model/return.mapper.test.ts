import { describe, expect, it } from 'vitest';
import type { ReturnEligibilityLineDto } from '@/generated/api/returns/returns.schemas';
import { canCustomerCancel, estimateSelection, toCreateReturnPayload, toReturnProgress } from './return.mapper';

const line = (overrides: Partial<ReturnEligibilityLineDto>): ReturnEligibilityLineDto => ({
  orderItemId: '1',
  sku: 'SKU-1',
  productName: 'Áo',
  variantName: 'L',
  imageUrl: null,
  isBundle: false,
  purchasedQuantity: 3,
  returnedQuantity: 0,
  returnableQuantity: 3,
  blockedByCategory: false,
  unitRefundEstimate: '100000.00',
  maxRefundEstimate: '300000.00',
  ...overrides,
});

const history = (statuses: string[]) => statuses.map((toStatus, index) => ({ sequenceNo: index + 1, action: 'X', fromStatus: null, toStatus, reason: null, createdAt: '' })) as never;

describe('toReturnProgress', () => {
  it('marks steps before the current status as done', () => {
    const steps = toReturnProgress({ status: 'RECEIVED', refundedAmount: '0.00', history: history(['REQUESTED', 'APPROVED', 'RECEIVED']) });
    expect(steps.map((step) => step.state)).toEqual(['done', 'done', 'current', 'upcoming', 'upcoming']);
  });

  it('completes every step once refunded and closed', () => {
    const steps = toReturnProgress({ status: 'CLOSED', refundedAmount: '350000.00', history: history([]) });
    expect(steps.every((step) => step.state === 'done')).toBe(true);
  });

  it('does not claim a refund on a closed return that refunded nothing', () => {
    const steps = toReturnProgress({ status: 'CLOSED', refundedAmount: '0.00', history: history([]) });
    expect(steps.find((step) => step.key === 'REFUNDED')?.state).toBe('upcoming');
  });

  it('stops at the last reached step for a rejected return', () => {
    const steps = toReturnProgress({ status: 'REJECTED', refundedAmount: '0.00', history: history(['REQUESTED', 'REJECTED']) });
    expect(steps.map((step) => step.key)).toEqual(['REQUESTED']);
  });
});

describe('toCreateReturnPayload', () => {
  it('keeps selected lines, caps quantities, sends whole combos and optional fields only when filled', () => {
    const lines = [
      line({ orderItemId: '1' }),
      line({ orderItemId: '2', isBundle: true, returnableQuantity: 2 }),
      line({ orderItemId: '3', returnableQuantity: 0, blockedByCategory: true }),
    ];
    expect(toCreateReturnPayload('DH-1', lines, { reasonCode: 'WRONG_SIZE', description: '  ', quantities: { '1': 9, '2': 1, '3': 1 } }, [])).toEqual({
      orderNo: 'DH-1',
      reasonCode: 'WRONG_SIZE',
      items: [{ orderItemId: '1', quantity: 3 }, { orderItemId: '2', quantity: 2 }],
    });
  });

  it('sends only the verification fields of uploaded images', () => {
    const payload = toCreateReturnPayload('DH-1', [line({})], { reasonCode: 'DEFECTIVE', description: 'rách', quantities: { '1': 1 } }, [
      { publicId: 'p', providerVersion: 1, providerSignature: 's', previewUrl: 'https://x/p.jpg' },
    ]);
    expect(payload.evidenceImages).toEqual([{ publicId: 'p', providerVersion: 1, providerSignature: 's' }]);
    expect(payload.description).toBe('rách');
  });
});

describe('estimateSelection', () => {
  it('uses unit estimates for partial lines and the rounded line estimate otherwise', () => {
    const lines = [line({ orderItemId: '1' }), line({ orderItemId: '2', isBundle: true, returnableQuantity: 1, maxRefundEstimate: '500000.00' })];
    expect(estimateSelection(lines, { '1': 2 })).toBe(200000);
    expect(estimateSelection(lines, { '1': 3, '2': 1 })).toBe(800000);
  });
});

describe('canCustomerCancel', () => {
  it('allows cancelling only before the goods are received', () => {
    expect(canCustomerCancel('REQUESTED')).toBe(true);
    expect(canCustomerCancel('APPROVED')).toBe(true);
    expect(canCustomerCancel('RECEIVED')).toBe(false);
  });
});
