import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { buttonVariants } from '@/foundation/components/buttons';
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
      iconWrapClassName="mx-auto grid size-20 place-items-center rounded-3xl bg-slate-50 text-slate-900 shadow-inner"
      icon={<ShoppingBag aria-hidden className="size-10" />}
      titleClassName="mt-6 text-2xl font-black text-slate-900"
      title="Giỏ hàng trống"
      descriptionClassName="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed"
      description="Bạn chưa có trang thiết bị nào trong giỏ hàng. Hãy khám phá các thiết bị thể thao chuẩn thi đấu để sẵn sàng bứt phá mục tiêu!"
      actions={
        <>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className={buttonVariants({ size: 'lg', className: 'rounded-full px-7 font-bold shadow-lg shadow-slate-900/20' })}
            >
              <ArrowLeft aria-hidden className="size-4" /> Tiếp tục mua sắm
            </Link>
          </div>

          {/* Quick Explore Pills */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gợi ý danh mục phổ biến:
            </span>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {QUICK_EXPLORE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
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
