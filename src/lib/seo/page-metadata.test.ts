import { describe, expect, it } from 'vitest';
import { buildPageMetadata, clampSeoText } from './page-metadata';



describe('clampSeoText', () => {
  it('giữ nguyên chuỗi ngắn, cắt chuỗi dài ở ranh giới từ kèm "…"', () => {
    expect(clampSeoText('Ngắn gọn', 55)).toBe('Ngắn gọn');
    const long = 'Chính sách đổi trả sản phẩm cho khách hàng tại Bảo An Sport áp dụng toàn quốc';
    const out = clampSeoText(long, 55)!;
    expect(out.length).toBeLessThanOrEqual(55);
    expect(out.endsWith('…')).toBe(true);
    expect(long.startsWith(out.slice(0, -1))).toBe(true);
  });

  it('buildPageMetadata kẹp mô tả quá dài', () => {
    const meta = buildPageMetadata({ title: 'A', description: 'x '.repeat(200), path: '/a' });
    expect(String(meta.description).length).toBeLessThanOrEqual(160);
  });
});

