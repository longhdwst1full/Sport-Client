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
