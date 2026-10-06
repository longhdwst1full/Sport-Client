import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import type { PriceRangeOption } from '../components/catalog-sidebar-filters';

// Khoảng giá gửi thẳng lên API (`minPrice`/`maxPrice`, VND) để lọc trên toàn bộ catalog
export const PRICE_RANGES: PriceRangeOption[] = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-2m', label: 'Dưới 2 triệu', max: '1999999' },
  { id: '2m-10m', label: '2 - 10 triệu', min: '2000000', max: '10000000' },
  { id: 'over-10m', label: 'Trên 10 triệu', min: '10000001' },
];

export const SORT_OPTIONS: Array<{ value: ProductListSort; label: string }> = [
  { value: ProductListSort.NEWEST, label: 'Mới nhất' },
  { value: ProductListSort.PRICE_ASC, label: 'Giá: Thấp đến Cao' },
  { value: ProductListSort.PRICE_DESC, label: 'Giá: Cao đến Thấp' },
  { value: ProductListSort.NAME_ASC, label: 'Tên: A → Z' },
];

export const isSort = (value: string | null): value is ProductListSort =>
  SORT_OPTIONS.some((option) => option.value === value);

/** Tham số lọc gửi lên `listCatalogProducts` (ngoài `limit`/`page`); `undefined` = không lọc. */
export interface CatalogListFilters {
  category?: string;
  search?: string;
  sort?: ProductListSort;
  minPrice?: string;
  maxPrice?: string;
}

export interface CatalogUrlState {
  activeTabSlug: string | null;
  activePriceRange: string;
  activeSort: ProductListSort;
  urlSearch: string;
  filters: CatalogListFilters;
}

/**
 * Đọc bộ lọc `/products` từ query string. Dùng chung cho route server (lấy trước trang 1 để HTML
 * có sẵn sản phẩm) và hook client, để hai bên luôn ra cùng tham số API — tức cùng query key.
 */
export function parseCatalogUrlState(get: (key: string) => string | null | undefined): CatalogUrlState {
  const activeTabSlug = get('category') || null;
  const priceParam = get('price') ?? null;
  const priceRange = PRICE_RANGES.find((range) => range.id === priceParam && range.id !== 'all');
  const sortParam = get('sort') ?? null;
  const activeSort: ProductListSort = isSort(sortParam) ? sortParam : ProductListSort.NEWEST;
  const urlSearch = get('q') ?? '';
  return {
    activeTabSlug,
    activePriceRange: priceRange?.id ?? 'all',
    activeSort,
    urlSearch,
    filters: {
      category: activeTabSlug ?? undefined,
      search: urlSearch.trim() || undefined,
      sort: activeSort === ProductListSort.NEWEST ? undefined : activeSort,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
    },
  };
}

export function isSameCatalogFilters(a: CatalogListFilters, b: CatalogListFilters): boolean {
  return (
    (a.category || undefined) === (b.category || undefined) &&
    (a.search?.trim() || undefined) === (b.search?.trim() || undefined) &&
    a.sort === b.sort &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice
  );
}
