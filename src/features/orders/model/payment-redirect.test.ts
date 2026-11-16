import { describe, expect, it } from 'vitest';
import { trustedPaymentRedirectUrl } from './payment-redirect';

describe('trustedPaymentRedirectUrl', () => {
  it('nhận URL cổng VNPay https (sandbox và production)', () => {
    const sandbox = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=100&vnp_SecureHash=abc';
    expect(trustedPaymentRedirectUrl(sandbox)).toBe(sandbox);
    expect(trustedPaymentRedirectUrl('https://pay.vnpay.vn/vpcpay.html?a=1')).toBe('https://pay.vnpay.vn/vpcpay.html?a=1');
  });

  it.each([
    ['javascript:', 'javascript:alert(document.cookie)'],
    ['http thường', 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html'],
    ['domain lạ', 'https://evil.example/pay'],
    ['domain giả dạng hậu tố', 'https://vnpayment.vn.evil.example/pay'],
    ['tên gần giống', 'https://fakevnpay.vn/pay'],
    ['kèm thông tin đăng nhập', 'https://user:pass@sandbox.vnpayment.vn/pay'],
    ['chuỗi không phải URL', 'not a url'],
    ['đường dẫn tương đối', '/orders/DH1'],
  ])('từ chối %s', (_label, raw) => {
    expect(trustedPaymentRedirectUrl(raw)).toBeNull();
  });

  it('rỗng/thiếu → null', () => {
    expect(trustedPaymentRedirectUrl(null)).toBeNull();
    expect(trustedPaymentRedirectUrl(undefined)).toBeNull();
    expect(trustedPaymentRedirectUrl('')).toBeNull();
  });
});
