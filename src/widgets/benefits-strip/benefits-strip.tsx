'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Headphones, RotateCcw, Truck, type LucideIcon } from 'lucide-react';

const BENEFITS: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
  tileBg: string;
  iconColor: string;
  ringGlow: string;
}> = [
  {
    icon: Truck,
    title: 'Giao & lắp rõ ràng',
    description: 'Xác nhận phí và thời gian trước khi chốt.',
    tileBg: 'bg-neutral-500/10 border-neutral-300 text-neutral-600',
    iconColor: 'text-neutral-600',
    ringGlow: 'group-hover:ring-neutral-400/40',
  },
  {
    icon: BadgeCheck,
    title: 'Giá minh bạch',
    description: 'Giá niêm yết đã bao gồm VAT.',
    tileBg: 'bg-success-500/10 border-success-300 text-success-600',
    iconColor: 'text-success-600',
    ringGlow: 'group-hover:ring-success-400/40',
  },
  {
    icon: Headphones,
    title: 'Tư vấn theo không gian',
    description: 'Cân đối mục tiêu, diện tích và ngân sách.',
    tileBg: 'bg-amber-500/10 border-amber-300 text-amber-600',
    iconColor: 'text-amber-600',
    ringGlow: 'group-hover:ring-amber-400/40',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả rõ ràng',
    description: 'Kiểm tra và xử lý theo từng sản phẩm.',
    tileBg: 'bg-red-500/10 border-red-300 text-red-600',
    iconColor: 'text-red-600',
    ringGlow: 'group-hover:ring-red-400/40',
  },
];

export function BenefitsStrip() {
  return (
    <section id="benefits" className="border-y border-neutral-200/80 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 py-7">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description, tileBg, ringGlow }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-neutral-300 hover:shadow-xl animate-shine"
          >
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${tileBg} shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:ring-4 ${ringGlow}`}
            >
              <Icon className="size-6 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed font-medium text-neutral-500">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

