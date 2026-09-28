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
