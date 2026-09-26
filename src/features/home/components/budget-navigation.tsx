'use client';

import Link from 'next/link';
import { Banknote, ChevronRight, Tag } from 'lucide-react';

interface BudgetTier {
  id: string;
  label: string;
  sublabel: string;
  tag: string;
  href: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'under-500k',
    label: 'Dưới 500K',
    sublabel: 'Dây kháng lực, con lăn, găng tay & phụ kiện',
    tag: 'Tiết kiệm',
    href: '/products?maxPrice=500000',
  },
  {
    id: '500k-2m',
    label: '500K – 2 Triệu',
    sublabel: 'Tạ tay, đòn tạ, xà đơn, thảm tập cao cấp',
    tag: 'Tập tại nhà',
    href: '/products?minPrice=500000&maxPrice=2000000',
  },
  {
    id: '2m-5m',
    label: '2 – 5 Triệu',
    sublabel: 'Ghế tập tạ đa năng, trụ đấm, bàn bóng bàn mini',
    tag: 'Bán chạy',
    href: '/products?minPrice=2000000&maxPrice=5000000',
  },
  {
    id: 'over-5m',
    label: 'Trên 5 Triệu',
    sublabel: 'Máy chạy bộ, giàn tạ khối, xe đạp thể lực',
    tag: 'Cao cấp',
    href: '/products?minPrice=5000000',
  },
];

export function BudgetNavigation() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <Banknote className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Tìm thiết bị theo mức ngân sách của bạn
              </h2>
              <p className="text-xs text-slate-500">
                Dễ dàng lựa chọn giải pháp tập luyện phù hợp với khả năng chi trả
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
          >
            <span>Xem tất cả mức giá</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {BUDGET_TIERS.map((tier) => (
            <Link
              key={tier.id}
              href={tier.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 transition hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-700">
                    <Tag className="size-3" />
                    {tier.tag}
                  </span>
                </div>
                <strong className="block text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
                  {tier.label}
                </strong>
                <p className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                  {tier.sublabel}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                <span>Xem danh sách</span>
                <ChevronRight className="size-4 transition group-hover:translate-x-1 text-slate-400 group-hover:text-emerald-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
