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
    <section id="benefits" className="border-y border-slate-200 bg-white py-6">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3.5 p-1">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-900">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              {/* Dải không có tiêu đề section: dùng <p> thay <h2> để không chen mục giả vào dàn heading trang chủ. */}
              <p className="text-sm font-black text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
