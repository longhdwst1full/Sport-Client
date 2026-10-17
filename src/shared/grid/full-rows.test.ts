import { describe, expect, it } from 'vitest';
import { trimToFullRows } from './full-rows';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

describe('trimToFullRows', () => {
  it('cắt hàng lẻ khi còn dữ liệu', () => {
    expect(trimToFullRows(range(10), 6)).toHaveLength(6);
    expect(trimToFullRows(range(25), 12)).toHaveLength(24);
  });
  it('giữ nguyên khi đã hết dữ liệu hoặc chưa đủ một bội số', () => {
    expect(trimToFullRows(range(10), 6, false)).toHaveLength(10);
    expect(trimToFullRows(range(3), 4)).toHaveLength(3);
    expect(trimToFullRows(range(12), 12)).toHaveLength(12);
  });
});
