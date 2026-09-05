import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Check, Home, Ruler, Warehouse } from 'lucide-react';

const SPACES = [
  {
    icon: Home,
    title: 'Góc tập nhỏ',
    meta: 'Dưới 8 m²',
    description: 'Ưu tiên thiết bị gấp gọn, tạ điều chỉnh và phụ kiện đa năng.',
  },
  {
    icon: Building2,
    title: 'Home gym gia đình',
    meta: 'Từ 8–20 m²',
    description: 'Kết hợp cardio và sức mạnh cho nhiều thành viên cùng sử dụng.',
  },
  {
    icon: Warehouse,
    title: 'Studio & phòng tập',
    meta: 'Trên 20 m²',
    description: 'Chọn theo công suất, tần suất vận hành và khả năng mở rộng.',
  },
] as const;

export function TrainingSpaceGuide() {
  return (
    <section id="consulting" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">
              Chọn đúng ngay từ đầu
            </p>
            <h2 className="mt-2.5 max-w-2xl text-balance text-3xl font-black leading-tight sm:text-4xl text-slate-900">
              Bắt đầu từ không gian, không phải từ chiếc máy.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Thiết bị tốt là thiết bị vừa diện tích, đúng mục tiêu và được sử dụng đều đặn.
              Chọn nhanh cấu hình gần với nhu cầu của bạn.
            </p>
            <div className="mt-8 grid gap-3">
              {SPACES.map(({ icon: Icon, title, meta, description }) => (
                <Link
                  key={title}
                  href="/#products"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-slate-200/80 p-4 transition hover:border-emerald-500/40 hover:bg-emerald-50/50"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-slate-900 text-white transition group-hover:bg-emerald-600">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-baseline gap-2">
                      <strong className="text-slate-900">{title}</strong>
                      <small className="font-extrabold text-emerald-700">{meta}</small>
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500 sm:text-sm">{description}</span>
                  </span>
                  <ArrowRight className="size-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[440px] overflow-hidden bg-slate-950">
            <Image
              src="https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?auto=format&fit=crop&w=1400&q=85"
              alt="Không gian home gym gọn gàng với thiết bị tập luyện"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 bg-white/95 p-5 backdrop-blur-md sm:inset-x-8 sm:bottom-8">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Ruler className="size-5" />
                </span>
                <strong className="text-sm font-black text-slate-900">Checklist trước khi mua</strong>
              </div>
              <ul className="mt-3 grid gap-2 text-xs font-semibold text-slate-700 sm:grid-cols-3">
                {['Đo diện tích', 'Xác định người tập', 'Chốt ngân sách'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
