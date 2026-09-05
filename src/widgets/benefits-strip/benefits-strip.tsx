import { BadgeCheck, Headphones, RotateCcw, Truck, type LucideIcon } from 'lucide-react';

const BENEFITS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: Truck, title: 'Giao & lắp rõ ràng', description: 'Xác nhận phí và thời gian trước khi chốt.' },
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
    <section id="benefits" className="border-y border-slate-200/80 bg-white py-6 shadow-sm">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3.5 p-1">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 shadow-sm">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-sm font-black text-slate-900">{title}</h2>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
