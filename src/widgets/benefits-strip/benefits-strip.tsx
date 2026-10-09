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
    tileBg: 'bg-sky-500/10 border-sky-300 text-sky-600',
    iconColor: 'text-sky-600',
    ringGlow: 'group-hover:ring-sky-400/40',
  },
  {
    icon: BadgeCheck,
    title: 'Giá minh bạch',
    description: 'Giá niêm yết đã bao gồm VAT.',
    tileBg: 'bg-emerald-500/10 border-emerald-300 text-emerald-600',
    iconColor: 'text-emerald-600',
    ringGlow: 'group-hover:ring-emerald-400/40',
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
    tileBg: 'bg-rose-500/10 border-rose-300 text-rose-600',
    iconColor: 'text-rose-600',
    ringGlow: 'group-hover:ring-rose-400/40',
  },
];

export function BenefitsStrip() {
  return (
    <section id="benefits" className="border-y border-slate-200/80 bg-gradient-to-r from-slate-50 via-white to-slate-50 py-7">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description, tileBg, ringGlow }, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-xl animate-shine"
          >
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl border ${tileBg} shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:ring-4 ${ringGlow}`}
            >
              <Icon className="size-6 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed font-medium text-slate-500">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

