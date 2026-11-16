'use client';

import { Reveal } from '@/foundation/components/motion';
import { BadgeCheck, Headphones, RotateCcw, Truck, type LucideIcon } from 'lucide-react';

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: BenefitItem[] = [
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

export function BenefitsStrip() {
  return (
    <section id="benefits" aria-label="Cam kết dịch vụ" className="border-y border-neutral-200 bg-neutral-50 py-7">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <Reveal
              key={title}
              stagger
              variant="fade-up"
              rootMargin="-40px"
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md hover:shadow-brand-950/5"
            >
              {/* Dynamic Icon Tile */}
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-neutral-200 bg-neutral-50 text-brand-600 transition-all duration-300 group-hover:scale-105 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-brand-600/25">
                <Icon className="size-5.5 transition-transform duration-300" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-neutral-900 transition-colors group-hover:text-brand-600 leading-snug">
                  {title}
                </h3>
                <p className="mt-1 text-xs font-medium leading-relaxed text-neutral-500">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
