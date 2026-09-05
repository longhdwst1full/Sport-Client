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
      <div className="overflow-hidden rounded-[36px] bg-white shadow-card">
        <div className="grid lg:grid-cols-[1.05fr_.95fr]">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-sm font-black uppercase tracking-[.2em] text-brand-600">
              Chọn đúng ngay từ đầu
            </p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-black leading-tight sm:text-5xl">
              Bắt đầu từ không gian, không phải từ chiếc máy.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-stone-600">
              Thiết bị tốt là thiết bị vừa diện tích, đúng mục tiêu và được sử dụng đều đặn.
              Chọn nhanh cấu hình gần với nhu cầu của bạn.
            </p>
            <div className="mt-8 grid gap-3">
              {SPACES.map(({ icon: Icon, title, meta, description }) => (
                <Link
                  key={title}
                  href="/#products"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-ink/10 p-4 transition hover:border-brand-600/40 hover:bg-brand-50"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-ink text-white">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="flex flex-wrap items-baseline gap-2">
                      <strong>{title}</strong>
                      <small className="font-bold text-brand-600">{meta}</small>
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-stone-500">{description}</span>
                  </span>
                  <ArrowRight className="size-5 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden bg-ink">
            <Image
              src="https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?auto=format&fit=crop&w=1400&q=85"
              alt="Không gian home gym gọn gàng với thiết bị tập luyện"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-3xl bg-white/95 p-6 backdrop-blur sm:inset-x-10 sm:bottom-10">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#d9ff45]">
                  <Ruler className="size-5" />
                </span>
                <strong>Checklist trước khi mua</strong>
              </div>
              <ul className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
                {['Đo diện tích', 'Xác định người tập', 'Chốt ngân sách'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-brand-600" /> {item}
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
