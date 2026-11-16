import { describe, expect, it } from 'vitest';
import { withoutQuery } from './vercel-insights';

describe('withoutQuery', () => {
  it('bỏ query + hash (token đặt lại mật khẩu, tham số vnp_*) nhưng giữ path', () => {
    expect(withoutQuery({ type: 'pageview', url: 'https://shop.test/reset-password?token=secret#x' })).toEqual({
      type: 'pageview',
      url: 'https://shop.test/reset-password',
    });
    expect(withoutQuery({ url: 'https://shop.test/checkout/vnpay-return?vnp_TxnRef=1&vnp_SecureHash=abc' }).url).toBe(
      'https://shop.test/checkout/vnpay-return',
    );
  });

  it('URL không phân tích được thì giữ nguyên, không ném lỗi', () => {
    expect(withoutQuery({ url: 'not a url' }).url).toBe('not a url');
  });
});
