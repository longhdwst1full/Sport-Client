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
    <section id="benefits" className="border-y border-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4 rounded-2xl p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-sm text-stone-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
