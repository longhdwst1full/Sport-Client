import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react';
import type { CartItem } from '@/app/store/cart.slice';
import type { CheckoutQuoteView } from '../model/checkout.mapper';
import { vndMoney } from '@/shared/format/money';
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/shared/constants';

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  localSubtotal: number;
  quote?: CheckoutQuoteView;
  busy: boolean;
  authLoaded: boolean;
  /** "Nhờ shop gửi": phí vận chuyển do shop báo và tính riêng, tổng chỉ gồm tiền hàng. */
  shopArranged?: boolean;
  /** Đang gọi báo giá: hiện "Đang tính phí", không bao giờ hiện 0 ₫ tạm. */
  quoting?: boolean;
  /** Nút đặt hàng chỉ có ở bước xác nhận; các bước trước điều hướng bằng nút trong từng bước. */
  showSubmit?: boolean;
  submitDisabled?: boolean;
  submitLabel?: string;
}

export function CheckoutOrderSummary({
  items,
  localSubtotal,
  quote,
  busy,
  authLoaded,
  shopArranged = false,
  quoting = false,
  showSubmit = false,
  submitDisabled = false,
  submitLabel = 'Đặt hàng',
}: CheckoutOrderSummaryProps) {
  // CONTRACT: báo giá chờ tư vấn không trả phí giao/tổng (Backend ẩn); hiển thị tiền hàng và ghi chú.
  const shippingPending = shopArranged || Boolean(quote?.requiresShippingConsultation);
  return (
    <aside>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-slate-900">Đơn hàng ({items.length})</h2>
          <Link href="/cart" className="text-xs font-bold text-emerald-700">Chỉnh sửa</Link>
        </div>
        <div className="mt-4 max-h-72 space-y-3 overflow-auto">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-3">
              <div className="relative size-12 overflow-hidden rounded-xl border bg-slate-50">
                <Image src={item.imageUrl || PRODUCT_PLACEHOLDER_IMAGE} alt={item.name} fill sizes="48px" className="object-contain p-1" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.sku} · ×{item.quantity}</p>
              </div>
              <strong className="text-xs">{vndMoney.format(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between"><span>Tạm tính tham khảo</span><span>{vndMoney.format(localSubtotal)}</span></div>
          {shippingPending ? (
            <>
              <div className="flex justify-between">
                <span>Phí giao</span>
                <span className="font-semibold text-amber-700">Shop báo sau</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-black">
                <span>Tiền hàng</span>
                <span className="text-emerald-700">{vndMoney.format(localSubtotal)}</span>
              </div>
              <p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                Chú ý: phí vận chuyển sẽ được shop gọi báo và tính riêng khi gửi hàng, chưa gồm trong số tiền trên.
              </p>
            </>
          ) : quoting || !quote ? (
            <div className="flex justify-between">
              <span>Phí giao</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                {quoting ? <><LoaderCircle className="size-3.5 animate-spin" /> Đang tính phí...</> : 'Chưa tính'}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Phí giao</span>
                <span>{quote.shippingTotalAmount === 0 ? 'Miễn phí' : quote.shippingTotalLabel}</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-black">
                <span>Khách thanh toán</span>
                <span className="text-emerald-700">{quote.grandTotalLabel}</span>
              </div>
            </>
          )}
        </div>
        {showSubmit && (
          <button type="submit" disabled={busy || !authLoaded || submitDisabled} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
            {busy ? <LoaderCircle className="size-5 animate-spin" /> : <CheckCircle2 className="size-5" />}
            {busy ? 'Đang xử lý...' : submitLabel}
          </button>
        )}
        <div className="mt-4 flex gap-2 text-xs leading-5 text-slate-500">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <span>Không lấy giá hoặc tồn từ dữ liệu lưu trên trình duyệt. Backend là nguồn quyết định cuối cùng.</span>
        </div>
      </div>
    </aside>
  );
}
