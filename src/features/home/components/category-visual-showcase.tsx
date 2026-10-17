import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryRailItem } from './category-rail-item';
import { CategoryRailCarousel } from './category-rail-carousel';
import type { CategoryRailView } from '@/features/catalog';
import { Reveal } from '@/foundation/components/motion';

/**
 * Rail danh mục trang chủ. Server component: tiêu đề và thẻ danh mục render ở server, chỉ phần cuộn/
 * autoplay/chỉ báo (`CategoryRailCarousel`) là client island.
 */
export function CategoryVisualShowcase({ items }: { items: CategoryRailView[] }) {
  return (
    <CategoryRailCarousel
      items={items.map((cat) => (
        <CategoryRailItem key={cat.id} category={cat} />
      ))}
      header={
        /* Section Header with Navigation Controls */
        <Reveal rootMargin="-60px" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-2xs">
              <span className="size-1.5 rounded-full bg-neutral-900" />
              Tìm nhanh theo bộ môn
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Bạn Muốn Tập Luyện Bộ Môn Nào?
            </h2>
            <p className="mt-1 text-xs text-neutral-500 font-medium sm:text-sm">
              Khám phá trang thiết bị thể thao chính hãng theo từng bộ môn chuyên biệt
            </p>
          </div>

          {/* Navigation Controls: View All */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/category"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800 hover:text-neutral-950 hover:underline transition rounded focus-ring"
            >
              <span>Xem tất cả danh mục</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      }
    />
  );
}
