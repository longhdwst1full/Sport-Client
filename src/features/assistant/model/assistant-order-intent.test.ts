import { describe, expect, it } from 'vitest';
import { mentionsOrder } from './assistant-order-intent';

describe('mentionsOrder', () => {
  it.each([
    'Đơn hàng của tôi giao tới đâu rồi?',
    'don hang cua minh sao chua toi',
    'kiểm tra mã đơn giúp mình',
    'đơn của tôi bị huỷ à',
    'tra cứu đơn DH260929000123',
    'Order status please',
    'vận đơn GHN bao giờ tới',
  ])('nhận ra câu hỏi về đơn: %s', (text) => {
    expect(mentionsOrder(text)).toBe(true);
  });

  it.each(['Vợt cầu lông giá bao nhiêu?', 'còn hàng size 42 không', 'bordered table', '', null, undefined])(
    'không gợi ý tra đơn: %s',
    (text) => {
      expect(mentionsOrder(text)).toBe(false);
    },
  );
});
