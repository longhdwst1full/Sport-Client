import { describe, expect, it } from 'vitest';
import { ProductMediaStatus } from '@/generated/api/catalog/catalog.schemas';
import type { ProductMediaDto } from '@/generated/api/catalog/catalog.schemas';
import { activeSortedMedia } from './product-media';

const m = (id: string, o: Partial<ProductMediaDto>) =>
  ({ id, secureUrl: `https://x/${id}`, status: ProductMediaStatus.ACTIVE, isPrimary: false, sortOrder: 0, ...o }) as ProductMediaDto;

describe('activeSortedMedia', () => {
  it('trả mảng rỗng khi không có media', () => {
    expect(activeSortedMedia(undefined)).toEqual([]);
    expect(activeSortedMedia(null)).toEqual([]);
  });

  it('bỏ media không ACTIVE hoặc thiếu secureUrl', () => {
    const list = [m('a', {}), m('b', { status: 'INACTIVE' as never }), m('c', { secureUrl: '' })];
    expect(activeSortedMedia(list).map((i) => i.id)).toEqual(['a']);
  });

  it('ảnh chính lên đầu rồi theo sortOrder, không đổi đầu vào', () => {
    const list = [m('a', { sortOrder: 2 }), m('b', { sortOrder: 1 }), m('p', { isPrimary: true, sortOrder: 9 })];
    expect(activeSortedMedia(list).map((i) => i.id)).toEqual(['p', 'b', 'a']);
    expect(list.map((i) => i.id)).toEqual(['a', 'b', 'p']);
  });
});
