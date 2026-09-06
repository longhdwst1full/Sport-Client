'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Ruler,
  Wrench,
} from 'lucide-react';
import { MOCK_GYM_PACKAGES as GYM_PACKAGES } from '@/shared/data/mocks';

export function GymProjectPlanner() {
  return (
    <section className="bg-slate-50/70 py-16 sm:py-24 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            <Sparkles className="size-3.5 text-emerald-600" /> Giải pháp setup trọn gói Bảo An Sport
          </span>
          <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">
            Thiết Kế Phòng Gym Theo Diện Tích Của Bạn
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Kế thừa hơn 10 năm kinh nghiệm thi công hàng nghìn phòng gym gia đình, chung cư và cơ quan từ Bảo An Sport — Dụng Cụ Thể Dục.
          </p>
        </div>

        {/* 3 Package Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {GYM_PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col overflow-hidden rounded-[32px] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  pkg.featured
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                    : 'border-slate-200/80'
                }`}
              >
                {/* Top Badge */}
                {pkg.featured && (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                    {pkg.badge}
                  </div>
                )}

                {/* Package Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                    <div className="flex items-center gap-2 text-white">
                      <Ruler className="size-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Diện tích: {pkg.space}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon className="size-4.5" />
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{pkg.title}</h3>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    {pkg.description}
                  </p>

                  <div className="mt-5 border-y border-slate-100 py-3.5">
                    <span className="block text-[11px] font-semibold text-slate-400">
                      Dự toán đầu tư thiết bị:
                    </span>
                    <strong className="text-xl font-black text-emerald-700">
                      {pkg.budget}
                    </strong>
                  </div>

                  {/* Checklist */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                    <span className="block font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                      Hạng mục thiết bị đề xuất:
                    </span>
                    {pkg.equipment.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="mt-8 pt-4">
                    <Link
                      href="/contact"
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs font-black transition ${
                        pkg.featured
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500'
                          : 'bg-slate-900 text-white hover:bg-emerald-600'
                      }`}
                    >
                      <span>Đăng ký nhận bản vẽ 3D</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-4 sm:p-8">
          {[
            { title: 'Khảo sát 24H', desc: 'Đo đạc diện tích tận nơi miễn phí' },
            { title: 'Bản vẽ 3D', desc: 'Phối cảnh góc nhìn thực tế' },
            { title: 'Lắp ráp chuẩn xác', desc: 'Đội ngũ kỹ thuật Bảo An Sport' },
            { title: 'Bảo trì trọn đời', desc: 'Định kỳ tra dầu & cân chỉnh cáp' },
          ].map((item, i) => (
            <div key={i} className="text-center sm:text-left">
              <strong className="block text-sm font-bold text-slate-900">{item.title}</strong>
              <span className="mt-0.5 block text-xs text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
