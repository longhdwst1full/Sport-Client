import { describe, expect, it } from 'vitest';
import { filterOptions, foldVietnamese, indexOptions } from './combobox-filter';

const provinces = indexOptions(
  ['Hà Nội', 'TP. Hồ Chí Minh', 'Bình Dương', 'Đà Nẵng', 'Hải Phòng', 'Thừa Thiên Huế'].map((label, i) => ({ value: String(i), label })),
);
const labels = (q: string) => filterOptions(provinces, q).map((o) => o.label);

describe('combobox filter', () => {
  it('bỏ dấu và đ', () => expect(foldVietnamese('Đống Đa')).toBe('dong da'));
  it('gõ không dấu', () => expect(labels('ha noi')).toEqual(['Hà Nội']));
  it('gõ có dấu', () => expect(labels('Đà')).toEqual(['Đà Nẵng']));
  it('viết tắt', () => {
    expect(labels('hcm')).toContain('TP. Hồ Chí Minh');
    expect(labels('bd')).toContain('Bình Dương');
  });
  it('khớp đầu chuỗi xếp trước khớp giữa', () => expect(labels('h')[0]).toBe('Hà Nội'));
  it('từ khoá rỗng trả đủ danh sách', () => expect(labels('  ')).toHaveLength(provinces.length));
  it('cùng hạng thì tên ngắn trước', () => {
    const districts = indexOptions(['Quận 12', 'Quận 11', 'Quận 10', 'Quận 1'].map((label) => ({ value: label, label })));
    expect(filterOptions(districts, 'q1')[0].label).toBe('Quận 1');
  });
  it('từ giữa tên', () => expect(labels('hue')).toEqual(['Thừa Thiên Huế']));
});
