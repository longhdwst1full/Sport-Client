import { ProductListSort } from '@/generated/api/catalog/catalog.schemas';
import type { PriceRangeOption } from '../components/catalog-sidebar-filters';

/**
 * Khoảng giá gửi thẳng lên API (`minPrice`/`maxPrice`, VND) để lọc trên toàn bộ catalog. Nguồn duy
 * nhất cho cả sidebar `/products` và thẻ "Theo ngân sách" ở trang chủ (link `?price=<id>`): trước
 * đây trang chủ dùng `?minPrice=` mà parser không đọc nên link không lọc gì, và hai nơi lệch mốc.
 */
export const PRICE_RANGES: PriceRangeOption[] = [
  { id: 'all', label: 'Tất cả mức giá' },
  { id: 'under-500k', label: 'Dưới 500K', max: '499999' },
  { id: '500k-2m', label: '500K – 2 triệu', min: '500000', max: '1999999' },
  { id: '2m-5m', label: '2 – 5 triệu', min: '2000000', max: '4999999' },
  { id: 'over-5m', label: 'Trên 5 triệu', min: '5000000' },
];

/** Link `/products` đã lọc theo một khoảng giá. */
export const priceRangeHref = (id: string) => `/products?price=${encodeURIComponent(id)}`;

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
  /** Slug thương hiệu (URL `?brand=`); API nhận mảng `brand[]`, storefront chọn một. */
  brand?: string;
  /** Chỉ sản phẩm còn hàng bán được (URL `?instock=1`). */
  inStock?: boolean;
}

/**
 * Chuyển bộ lọc storefront sang tham số `listCatalogProducts`. Một chỗ duy nhất đổi hình dạng
 * (`brand` → `brand[]`) để route server và hook client gửi giống hệt nhau (cùng query key).
 */
export function toListCatalogParams(filters: CatalogListFilters) {
  const { brand, inStock, ...rest } = filters;
  return {
    ...rest,
    ...(brand ? { brand: [brand] } : {}),
    ...(inStock ? { inStock: true } : {}),
  };
}

export interface CatalogUrlState {
  activeTabSlug: string | null;
  activePriceRange: string;
  activeSort: ProductListSort;
  urlSearch: string;
  activeBrand: string | null;
  inStockOnly: boolean;
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
  const activeBrand = get('brand') || null;
  const inStockOnly = get('instock') === '1';
  return {
    activeTabSlug,
    activePriceRange: priceRange?.id ?? 'all',
    activeSort,
    urlSearch,
    activeBrand,
    inStockOnly,
    filters: {
      category: activeTabSlug ?? undefined,
      search: urlSearch.trim() || undefined,
      sort: activeSort === ProductListSort.NEWEST ? undefined : activeSort,
      minPrice: priceRange?.min,
      maxPrice: priceRange?.max,
      brand: activeBrand ?? undefined,
      inStock: inStockOnly || undefined,
    },
  };
}

export function isSameCatalogFilters(a: CatalogListFilters, b: CatalogListFilters): boolean {
  return (
    (a.category || undefined) === (b.category || undefined) &&
    (a.search?.trim() || undefined) === (b.search?.trim() || undefined) &&
    a.sort === b.sort &&
    a.minPrice === b.minPrice &&
    a.maxPrice === b.maxPrice &&
    (a.brand || undefined) === (b.brand || undefined) &&
    Boolean(a.inStock) === Boolean(b.inStock)
  );
}
