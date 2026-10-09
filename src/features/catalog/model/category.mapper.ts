import {
  Bike,
  Dumbbell,
  Footprints,
  Goal,
  HeartPulse,
  Swords,
  type LucideIcon,
} from 'lucide-react';
import type { CatalogCategoryDto } from '@/generated/api/catalog/catalog.schemas';

export interface CategoryCardView {
  slug: string;
  title: string;
  description: string;
  /** Nhãn hiển thị dựng từ `productCount` thật, không phải số ước lượng. */
  itemCountLabel: string;
  imageUrl: string | null;
  icon: LucideIcon;
  /** Danh mục con có sản phẩm (chỉ có khi dựng bằng `toCategoryTreeCardViews`). */
  subcategories?: Array<{ slug: string; title: string }>;
}

/**
 * Icon là quyết định trình bày nên nằm ở client, map theo `slug` ổn định
 * (`08-enums-constants.md`, RULE-DT-05). Backend không lưu tên icon.
 */
const iconBySlug: Record<string, LucideIcon> = {
  'tap-gym': Dumbbell,
  'ghe-tap-ta': Dumbbell,
  'chay-bo': Footprints,
  'may-chay-bo': Footprints,
  'bong-da': Goal,
  'dung-cu-bong-ban': Goal,
  'yoga-phuc-hoi': HeartPulse,
  'xe-dap-the-thao': Bike,
  'dung-cu-vo-thuat': Swords,
};

export function toCategoryCardView(dto: CatalogCategoryDto): CategoryCardView {
  return {
    slug: dto.slug,
    title: dto.name,
    description: dto.description ?? '',
    itemCountLabel:
      dto.productCount > 0 ? `${dto.productCount} sản phẩm` : 'Đang cập nhật sản phẩm',
    imageUrl: dto.imageUrl ?? null,
    icon: iconBySlug[dto.slug] ?? Dumbbell,
  };
}

/**
 * Danh sách `/category`: chỉ danh mục gốc (có sản phẩm ở chính nó hoặc ở con), danh mục con thành chip
 * trong thẻ cha — thay vì ~60 thẻ ngang hàng, phần lớn chỉ 1–2 sản phẩm.
 */
export function toCategoryTreeCardViews(dtos: readonly CatalogCategoryDto[]): CategoryCardView[] {
  const childrenByParent = new Map<string, CatalogCategoryDto[]>();
  for (const dto of dtos) {
    if (!dto.parentSlug || dto.productCount <= 0) continue;
    childrenByParent.set(dto.parentSlug, [...(childrenByParent.get(dto.parentSlug) ?? []), dto]);
  }
  return dtos
    .filter((dto) => !dto.parentSlug && (dto.productCount > 0 || childrenByParent.has(dto.slug)))
    .sort((left, right) => right.productCount - left.productCount)
    .map((dto) => ({
      ...toCategoryCardView(dto),
      subcategories: (childrenByParent.get(dto.slug) ?? [])
        .sort((left, right) => right.productCount - left.productCount)
        .map((child) => ({ slug: child.slug, title: child.name })),
    }));
}

export interface CategoryRailView {
  id: string;
  name: string;
  count: string;
  href: string;
  imageUrl: string | null;
  color: string;
}

/** Gradient là trang trí thuần, gán theo vị trí để rail luôn đủ màu. */
const railColors = [
  'from-neutral-900/15 to-neutral-300/10',
  'from-brand-500/15 to-neutral-200/10',
  'from-neutral-600/15 to-neutral-200/10',
];

export function toCategoryRailView(dto: CatalogCategoryDto, index: number): CategoryRailView {
  return {
    id: dto.code,
    name: dto.name,
    count: dto.productCount > 0 ? `${dto.productCount} sản phẩm` : 'Đang cập nhật',
    href: `/category/${dto.slug}`,
    imageUrl: dto.imageUrl ?? null,
    color: railColors[index % railColors.length],
  };
}
