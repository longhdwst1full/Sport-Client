import Link from 'next/link';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { formatVnd } from '@/shared/format/money';
import { SHIPPING_FEE } from '../model/cart.constants';

interface CartSummaryProps {
  selectedCount: number;
  subtotal: number;
  total: number;
  checkoutHref: string;
  onCheckoutClick: (e: React.MouseEvent) => void;
}

export function CartSummary({
  selectedCount,
  subtotal,
  total,
  checkoutHref,
  onCheckoutClick,
}: CartSummaryProps) {
  return (
    <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:sticky lg:top-40">
      <h2 className="text-lg font-black text-slate-900">Tóm tắt đơn hàng</h2>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Tạm tính ({selectedCount} sản phẩm)</span>
          <span className="font-semibold text-slate-900">{formatVnd(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Phí vận chuyển</span>
          <span className="font-semibold text-slate-900">{selectedCount > 0 ? formatVnd(SHIPPING_FEE) : '0 ₫'}</span>
        </div>
        <hr className="border-slate-100" />
        <div className="flex justify-between text-base">
          <span className="font-bold text-slate-900">Tổng thanh toán</span>
          <strong className="text-xl font-black text-emerald-700">{formatVnd(total)}</strong>
        </div>
      </div>

      {/* Checkout Button: "Đặt hàng" */}
      <Link
        href={checkoutHref}
        onClick={onCheckoutClick}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white shadow-lg transition ${
          selectedCount > 0
            ? 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500 cursor-pointer'
            : 'bg-slate-300 shadow-none cursor-not-allowed'
        }`}
      >
        Đặt hàng {selectedCount > 0 ? `(${selectedCount})` : ''}
      </Link>
      <Link
        href="/products"
        className="mt-3 block text-center text-xs font-semibold text-slate-500 transition hover:text-emerald-700"
      >
        ← Tiếp tục mua sắm
      </Link>

      {/* Conversion Trust Commitments */}
      <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span>100% Chính hãng Bảo An Sport · Bảo hành 24T</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="size-4 text-emerald-600 shrink-0" />
          <span>Đổi mới trong 7 ngày nếu lỗi từ NSX</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="size-4 text-emerald-600 shrink-0" />
          <span>Kiểm tra hàng trước khi thanh toán COD</span>
        </div>
      </div>
    </aside>
  );
}
