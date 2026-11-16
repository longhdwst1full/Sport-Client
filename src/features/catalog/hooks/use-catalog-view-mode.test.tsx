// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseCatalogViewMode, useCatalogViewMode, withCatalogViewMode } from './use-catalog-view-mode';

const replace = vi.fn();
let search = '';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(search),
}));

describe('catalog view mode', () => {
  beforeEach(() => {
    replace.mockClear();
    search = '';
  });

  it('parse: chỉ "list" là danh sách, còn lại là lưới', () => {
    expect(parseCatalogViewMode('list')).toBe('list');
    expect(parseCatalogViewMode('grid')).toBe('grid');
    expect(parseCatalogViewMode('xyz')).toBe('grid');
    expect(parseCatalogViewMode(null)).toBe('grid');
  });

  it('serialize: giữ nguyên tham số khác, lưới xoá khoá view', () => {
    expect(withCatalogViewMode('category=a&sort=PRICE_ASC', 'list')).toBe('category=a&sort=PRICE_ASC&view=list');
    expect(withCatalogViewMode('q=x&view=list', 'grid')).toBe('q=x');
    expect(withCatalogViewMode('', 'grid')).toBe('');
  });

  it('setViewMode dùng replace scroll:false và giữ bộ lọc/trang', () => {
    search = 'category=may-chay&page=3';
    const { result } = renderHook(() => useCatalogViewMode());
    expect(result.current.viewMode).toBe('grid');
    act(() => result.current.setViewMode('list'));
    expect(replace).toHaveBeenCalledWith('/products?category=may-chay&page=3&view=list', { scroll: false });
  });

  it('về lưới thì bỏ ?view, không còn param thì chỉ còn pathname; không đổi thì không replace', () => {
    search = 'view=list';
    const { result } = renderHook(() => useCatalogViewMode());
    expect(result.current.viewMode).toBe('list');
    act(() => result.current.setViewMode('list'));
    expect(replace).not.toHaveBeenCalled();
    act(() => result.current.setViewMode('grid'));
    expect(replace).toHaveBeenCalledWith('/products', { scroll: false });
  });
});
