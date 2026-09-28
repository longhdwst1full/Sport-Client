import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { EmptyState } from '@/foundation/components/feedback';

const QUICK_EXPLORE_CATEGORIES = [
  { name: 'Máy chạy bộ', href: '/products?category=may-chay-bo' },
  { name: 'Xe đạp tập', href: '/products?category=xe-dap-tap' },
  { name: 'Dụng cụ gym', href: '/products?category=dung-cu-tap-gym' },
  { name: 'Bóng bàn', href: '/products?category=dung-cu-bong-ban' },
  { name: 'Cầu lông', href: '/products?category=dung-cu-cau-long' },
];

export function CartEmpty() {
  return (
    <EmptyState
      className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-16 shadow-sm"
      iconWrapClassName="mx-auto grid size-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner"
      icon={<ShoppingBag className="size-10" />}
      titleClassName="mt-6 text-2xl font-black text-slate-900"
      title="Giỏ hàng trống"
      descriptionClassName="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed"
      description="Bạn chưa có trang thiết bị nào trong giỏ hàng. Hãy khám phá các thiết bị thể thao chuẩn thi đấu để sẵn sàng bứt phá mục tiêu!"
      actions={
        <>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
            >
              <ArrowLeft className="size-4" /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* Quick Explore Pills */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gợi ý danh mục phổ biến:
            </span>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {QUICK_EXPLORE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </>
      }
    />
  );
}
