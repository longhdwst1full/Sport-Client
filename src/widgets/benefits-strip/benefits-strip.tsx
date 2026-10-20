'use client';

import { Reveal } from '@/foundation/components/motion';
import { BadgeCheck, Headphones, RotateCcw, Truck, type LucideIcon } from 'lucide-react';

const BENEFITS: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Truck,
    title: 'Giao & lắp rõ ràng',
    description: 'Xác nhận phí và thời gian trước khi chốt.',
  },
  {
    icon: BadgeCheck,
    title: 'Giá minh bạch',
    description: 'Giá niêm yết đã bao gồm VAT.',
  },
  {
    icon: Headphones,
    title: 'Tư vấn theo không gian',
    description: 'Cân đối mục tiêu, diện tích và ngân sách.',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả rõ ràng',
    description: 'Kiểm tra và xử lý theo từng sản phẩm.',
  },
];

/**
 * Một kiểu ô icon cho cả bốn cam kết (bảng màu logo, `20-design-tokens.md`): nền xám nhạt, icon đỏ thương
 * hiệu. Trước đây mỗi ô một màu (xanh/amber/sky) không mang nghĩa trạng thái.
 */
const BENEFIT_ICON_TILE = 'border-neutral-200 bg-neutral-50 text-brand-600 group-hover:border-brand-200 group-hover:bg-brand-50';

export function BenefitsStrip() {
  return (
    <section id="benefits" className="border-y border-neutral-200 bg-neutral-50 py-7">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <Reveal
            key={title}
            stagger
            rootMargin="-40px"
            className="group hover:-translate-y-1 hover:scale-[1.02] flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-neutral-300 hover:shadow-xl animate-shine"
          >
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl border transition-colors duration-300 ${BENEFIT_ICON_TILE}`}
            >
              <Icon className="size-6 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed font-medium text-neutral-500">{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

