import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryRailItem } from './category-rail-item';
import { CategoryRailCarousel } from './category-rail-carousel';
import type { CategoryRailView } from '@/features/catalog';
import { Reveal } from '@/foundation/components/motion';
import { SectionHeading } from '@/foundation/components/structure/section-heading';

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
        <Reveal rootMargin="-60px">
          <SectionHeading
            eyebrow="Khám phá thiết bị"
            title="Danh Mục Thể Thao Nổi Bật"
            description="Trang thiết bị và dụng cụ tập luyện chính hãng theo từng bộ môn chuyên biệt"
            action={
              <Link
                href="/category"
                className="inline-flex shrink-0 items-center gap-1.5 rounded text-xs font-bold text-neutral-800 transition hover:text-neutral-950 hover:underline focus-ring sm:text-sm"
              >
                <span>Xem tất cả danh mục</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
        </Reveal>
      }
    />
  );
}
