import { describe, expect, it } from 'vitest';
import { resolveCheckoutQuoteGate } from './checkout-quote-gate';

const base = { readyToQuote: true, autoQuoting: false, hasQuote: false, quoteError: '' };

describe('resolveCheckoutQuoteGate', () => {
  it('thiếu địa chỉ thì bắt điền địa chỉ trước', () => {
    expect(resolveCheckoutQuoteGate({ ...base, readyToQuote: false })).toEqual({ kind: 'ADDRESS_INCOMPLETE' });
  });

  it('vừa đổi COD/cách giao, còn trong debounce: coi là đang báo giá, không báo thiếu phí', () => {
    expect(resolveCheckoutQuoteGate(base)).toEqual({ kind: 'QUOTING' });
  });

  it('lượt báo giá đang chạy', () => {
    expect(resolveCheckoutQuoteGate({ ...base, autoQuoting: true })).toEqual({ kind: 'QUOTING' });
  });

  it('báo giá lỗi: giữ lý do thật từ API', () => {
    expect(resolveCheckoutQuoteGate({ ...base, quoteError: 'No branch currently has enough stock for the entire cart' }))
      .toEqual({ kind: 'QUOTE_FAILED', reason: 'No branch currently has enough stock for the entire cart' });
  });

  it('đã có quote thì cho đi tiếp', () => {
    expect(resolveCheckoutQuoteGate({ ...base, hasQuote: true, quoteError: 'cũ' })).toEqual({ kind: 'READY' });
  });
});
