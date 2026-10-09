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
    tileBg: 'bg-sky-500/10 border-sky-200 text-sky-600',
    iconColor: 'text-sky-600',
    ringGlow: 'group-hover:ring-sky-400/30',
  },
  {
    icon: BadgeCheck,
    title: 'Giá minh bạch',
    description: 'Giá niêm yết đã bao gồm VAT.',
    tileBg: 'bg-emerald-500/10 border-emerald-200 text-emerald-600',
    iconColor: 'text-emerald-600',
    ringGlow: 'group-hover:ring-emerald-400/30',
  },
  {
    icon: Headphones,
    title: 'Tư vấn theo không gian',
    description: 'Cân đối mục tiêu, diện tích và ngân sách.',
    tileBg: 'bg-amber-500/10 border-amber-200 text-amber-600',
    iconColor: 'text-amber-600',
    ringGlow: 'group-hover:ring-amber-400/30',
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả rõ ràng',
    description: 'Kiểm tra và xử lý theo từng sản phẩm.',
    tileBg: 'bg-rose-500/10 border-rose-200 text-rose-600',
    iconColor: 'text-rose-600',
    ringGlow: 'group-hover:ring-rose-400/30',
  },
];

export function BenefitsStrip() {
  return (
    <section id="benefits" className="border-y border-neutral-200/80 bg-gradient-to-r from-neutral-50/90 via-white to-neutral-50/90 py-6">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description, tileBg, ringGlow }) => (
          <div
            key={title}
            className="group flex items-start gap-3.5 rounded-2xl border border-neutral-200/60 bg-white p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
          >
            <span
              className={`grid size-11 shrink-0 place-items-center rounded-xl border ${tileBg} shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:ring-4 ${ringGlow}`}
            >
              <Icon className="size-5 transition-transform duration-300 group-hover:rotate-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-neutral-900 group-hover:text-red-600 transition-colors">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed font-medium text-neutral-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

