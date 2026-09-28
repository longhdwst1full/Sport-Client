import Link from 'next/link';
import { CreditCard, Truck } from 'lucide-react';

/** Không còn dòng nào để thanh toán (giỏ trống hoặc tham số mua ngay/chọn dòng không khớp giỏ). */
export function CheckoutEmptyCart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/cart" className="text-sm font-bold text-emerald-700 hover:underline">
          ← Quay lại giỏ hàng
        </Link>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Thanh toán đơn hàng
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center sm:p-12 shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <Truck className="size-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-900">Giỏ hàng của bạn đang trống</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
            Bạn chưa có sản phẩm nào trong giỏ để thực hiện thanh toán. Vui lòng chọn sản phẩm thể thao ưng ý trước khi hoàn tất đặt hàng.
          </p>

          {/* Payment Methods Info */}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Phương thức thanh toán hỗ trợ:
            </span>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200">
                <span className="grid size-6 place-items-center rounded bg-emerald-100 text-emerald-700 font-extrabold text-[10px]">COD</span>
                <span>Thanh toán khi nhận hàng (COD)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-slate-200">
                <CreditCard className="size-4 text-emerald-600" />
                <span>Chuyển khoản VietQR / VNPay</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <span>Tiếp tục mua sắm</span>
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <span>Về giỏ hàng</span>
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-black text-slate-950">Tóm tắt đơn hàng</h2>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Tạm tính</span>
              <span className="font-bold text-slate-900">0 ₫</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Phí vận chuyển</span>
              <span className="text-slate-400">Tính khi có hàng</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-950">
              <span>Tổng tiền</span>
              <span className="text-emerald-700">0 ₫</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
